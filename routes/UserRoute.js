import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, login, logout } from "../controllers/UserController.js";
import { requireRoles, validateToken } from "../middlewares/auth.js";

const router = express.Router()

router.route("").get(validateToken, requireRoles(["admin"]), getUsers).post(createUser)
router.route("/:id").get(validateToken, requireRoles(["admin"]), getUserById).put(validateToken, requireRoles(["admin"]), updateUser).delete(validateToken, requireRoles(["admin"]), deleteUser)


export default router