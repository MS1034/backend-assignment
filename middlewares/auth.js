import jwt from "jsonwebtoken";
import { asyncFuncErrorWraper } from "../utils/ErrorHandler.js";
import AppError from "../utils/CustomError.js";


export const validateToken = asyncFuncErrorWraper(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(req.headers.authorization);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        console.log(process.env.SECRET)
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                return res
                    .status(403)
                    .json({ message: "Failed to authenticate token. " + err.message });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        throw new AppError("Failed to find the token", 401);
    }
});

export const requireRoles = (roles) => {
    return asyncFuncErrorWraper(async (req, res, next) => {
        try {
            const userRole = req.user.role;
            console.log(`User Role: ${userRole}`);

            if (roles.includes(userRole)) {
                console.log(`Role is included`);
                next();
            } else {
                res.status(403).json({ message: "Permission denied" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
};
export const GenerateToken = (user) => {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    return token;
};

