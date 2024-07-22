import AppError from "../utils/CustomError.js"
import { asyncFuncErrorWraper, funcErrorWraper } from "../utils/ErrorHandler.js"
import getClient from "../database/connection.js"

export const getItems = asyncFuncErrorWraper(async (req, res) => {
    let visibility = req.query.visibility;
    if (visibility) {
        visibility = visibility === 'true';
    } else {
        visibility = true;
    }

    const client = await getClient();
    try {
        const queryText = 'SELECT * FROM topics where is_visible=$1';
        const params = [visibility]
        const result = await client.query(queryText, params);
        const items = result.rows;
        res.status(200).json(items);
    } finally {
        client.end();
    }
});



export const getItemById = asyncFuncErrorWraper(async (req, res) => {
    const id = +req.params.id;
    const client = await getClient();
    try {
        const queryText = 'SELECT * FROM topics WHERE id = $1';
        const result = await client.query(queryText, [id]);

        const item = result.rows;
        if (item) {
            res.status(200).json(item);
        } else {
            throw new AppError(`Record with id=${id} not found.`, 404);
        }
    } finally {
        client.end();
    }
});


export const createItem = asyncFuncErrorWraper(async (req, res) => {
    const { title, time, link } = req.body;
    const isVisible = req.body.isVisible ?? true;

    if (!title || !time || !link) {
        throw new AppError(`Title, Time, and Link are required to create a js topic.`, 400);
    }

    const client = await getClient();
    try {
        const queryText = 'INSERT INTO topics(title, time, link, is_visible) VALUES($1, $2, $3, $4) RETURNING *';
        const queryParams = [title, time, link, isVisible]

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



export const updateItem = asyncFuncErrorWraper(
    async (req, res) => {
        const id = +req.params.id
        const { title, time, link } = req.body

        if (!title && !time && !link)
            throw new AppError(`Not enough information passed to update a js topic.`, 400)

        const queryText = 'UPDATE topics SET title = $2, time = $3, link = $4, updated_at = to_timestamp($5 / 1000.0) WHERE id = $1 RETURNING *';

        const queryParams = [id, title, time, link, Date.now()];
        const client = await getClient()
        try {
            const result = await client.query(queryText, queryParams)
            const item = result?.rows
            if (item)
                res.status(200).json(item)
            else
                throw new AppError(`Bad request topic with ${id} not found.`, 400)
        }
        finally {
            client.end()
        }
    }
)


export const updateVisibility = asyncFuncErrorWraper(
    async (req, res) => {
        const id = +req.params.id
        let visibility = req.query.visibility;

        if (visibility)
            visibility = visibility === 'true'
        else
            throw new AppError(`Bad request pass the status in the parameters.`, 400)

        const queryTextGet = 'SELECT * FROM topics WHERE id = $1';
        const queryParams = [id];
        const client = await getClient()
        try {
            const response = await client.query(queryTextGet, queryParams)
            const item = response.rows[0]
            if (item) {
                if (item.is_visible === visibility)
                    throw new AppError(`Bad request topic is already ${visibility ? "shown" : "hidden"}.`, 400)

                console.log('hello')
                const queryTextUpdate = 'UPDATE topics SET is_visible =$2, updated_at =to_timestamp($3/1000.0) WHERE id = $1 RETURNING *';
                queryParams.push(visibility)
                queryParams.push(Date.now())
                const result = await client.query(queryTextUpdate, queryParams)
                res.status(200).json(result.rows)
            }
            else
                throw new AppError(`Record with id=${id} not found.`, 404)
        }
        finally {
            client.end();
        }

    }
)



export const deleteItem = asyncFuncErrorWraper(
    async (req, res) => {
        const id = +req.params.id
        const queryText = 'DELETE FROM topics WHERE id = $1 RETURNING *';
        const queryParams = [id];
        const client = await getClient()
        try {
            const result = await client.query(queryText, queryParams)
            const item = result.rows
            if (result)
                res.status(200).json(item)
            else
                throw new AppError(`Record with id=${id} not found.`, 404)
        }
        finally {
            client.end();
        }
    }
)


