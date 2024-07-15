import express from "express";
import { getItems, getItemById, createItem, updateItem, updateVisibility, deleteItem } from "../controllers/ItemsController.js";

const router = express.Router()

router.get("/items", getItems)
router.get("/items/:id", getItemById)
router.post("/items", createItem)
router.put("/items/:id", updateItem)
router.patch("/items/:id", updateVisibility)
router.delete("/items/:id", deleteItem)

export default router