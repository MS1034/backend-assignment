import express from "express";
import { getItems, getItemById, createItem, updateItem, updateVisibility, deleteItem } from "../controllers/ItemsController.js";

const router = express.Router()

router.get("", getItems)
router.get("/:id", getItemById)
router.post("", createItem)
router.put("/:id", updateItem)
router.patch("/:id", updateVisibility)
router.delete("/:id", deleteItem)

export default router