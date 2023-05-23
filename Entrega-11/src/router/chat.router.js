import express from "express";
import { addChats, deleteChats, editChats, getChats } from "../controllers/chat.js";

const router = express.Router();

router.get("/", getChats);
router.post("/", addChats);
router.put("/:id", editChats);
router.delete("/:id", deleteChats);

export default router;