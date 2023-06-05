import express from "express";
import { createTicket, getTicket, getTicketById } from "../controllers/ticket.js";

const router = express.Router();

router.get("/", getTicket);
router.get("/:tid", getTicketById);
router.post("/:uid/purchase", createTicket);
// router.delete("/:cid/products/:pid", productDelete);

export default router;