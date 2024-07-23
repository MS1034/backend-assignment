import express from "express";
import { login, logout } from "../controllers/UserController.js";
import { validateToken } from "../middlewares/auth.js";

const router = express.Router()
router.post("/login", login)
router.get("/logout", validateToken, logout)

export default router