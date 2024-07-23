import express from "express";
import { getItems, getItemById, createItem, updateItem, updateVisibility, deleteItem } from "../controllers/ItemsController.js";

const router = express.Router()

router.route("").get(getItems).post(createItem)
router.route("/:id").get(getItemById).put(updateItem).patch(updateVisibility).delete(deleteItem)

export default router