import AppError from "../utils/CustomError.js"
import { asyncFuncErrorWraper } from "../utils/ErrorHandler.js"
import getClient from "../database/connection.js"
import { GenerateToken } from "../middlewares/auth.js";
const { comparePasswords, hashPassword } = require("../utils/PasswordHelper.js");


export const getUsers = asyncFuncErrorWraper(async (req, res) => {
    let visibility = req.query.visibility;
    if (visibility) {
        visibility = visibility === 'true';
    } else {
        visibility = true;
    }

    const client = await getClient();
    try {
        const queryText = 'SELECT * FROM users';
        const result = await client.query(queryText);
        const users = result.rows;
        res.status(200).json(users);
    } finally {
        client.end();
    }
});



export const getUserById = asyncFuncErrorWraper(async (req, res) => {
    const id = +req.params.id;
    const client = await getClient();
    try {
        const queryText = 'SELECT * FROM users WHERE id = $1';
        const result = await client.query(queryText, [id]);

        const user = result.rows;
        if (user) {
            res.status(200).json(user);
        } else {
            throw new AppError(`Record with id=${id} not found.`, 404);
        }
    } finally {
        client.end();
    }
});


export const createUser = asyncFuncErrorWraper(async (req, res) => {
    const { email, firstName, lastName, role, password } = req.body;

    if (!email || !firstName || !lastName || !role || !password) {
        throw new AppError(`Email, FirstName, LastName,  role and password are required to create a user.`, 400);
    }

    const client = await getClient();
    try {
        const queryText = 'INSERT INTO users(email, firstName, lastName, role, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
        password = await hashPassword(password);
        const queryParams = [email, firstName, lastName, role, password]

        console.log(queryParams)
        const result = await client.query(queryText, queryParams);

        if (result.rows.length > 0) {
            res.status(201).json(result.rows);
        } else {
            throw new AppError(`Operational Error. Failed to create new object.`, 500);
        }
    } finally {
        client.end();
    }
});

export const updateUser = asyncFuncErrorWraper(
    async (req, res) => {
        const id = +req.params.id
        const { email, firstName, lastName, role } = req.body;
        let { password } = req.body;
        if (password) password = await hashPassword(password)

        if (!email && !firstName && !lastName && !role && !password) {
            throw new AppError(`no field provided to update a user.`, 400);
        }

        const queryText = `UPDATE users SET ${email ? "email = $2" : ""},${firstName ? "first_name = $3" : ""},${lastName ? "last_name = $4" : ""} , ${role ? "role = $5" : ""}, ${password ? "password = $6" : ""}  WHERE id = $1 RETURNING *`;

        const queryParams = [id, email, firstName, lastName, role, password];
        const client = await getClient()
        try {
            const result = await client.query(queryText, queryParams)
            const user = result?.rows
            if (user)
                res.status(200).json(user)
            else
                throw new AppError(`Bad request record with ${id} not found.`, 400)
        }
        finally {
            client.end()
        }
    }
)

export const deleteUser = asyncFuncErrorWraper(
    async (req, res) => {
        const id = +req.params.id
        const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const queryParams = [id];
        const client = await getClient()
        try {
            const result = await client.query(queryText, queryParams)
            const user = result.rows
            if (result)
                res.status(200).json(user)
            else
                throw new AppError(`Record with id=${id} not found.`, 404)
        }
        finally {
            client.end();
        }
    }
)

export const login = asyncFuncErrorWraper(
    async (req, res) => {
        const { emailAddress, password } = req.body;
        const queryText = 'SELECT * FROM users WHERE email = $1 RETURNING *';
        const queryParams = [emailAddress];

        try {
            const result = await client.query(queryText, queryParams)
            const user = result.rows[0]

            if (user) {
                if (await comparePasswords(password, user.password)) {
                    const token = GenerateToken(user);
                    req.session.token = token
                    res.status(200).send(user)
                }
            }
            else
                throw new AppError(`User not found.`, 404)
        }
        finally {
            client.end();
        }


    }
)
export const logout = asyncFuncErrorWraper(async (req, res) => {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
})