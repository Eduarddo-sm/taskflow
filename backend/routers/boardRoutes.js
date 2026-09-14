import express from "express";
import { getBoard, createBoard, putBoard, deleteBoard } from "../controllers/boardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getBoard);
router.post("/", authenticateToken, createBoard);
router.put("/:id", authenticateToken, putBoard);
router.delete("/:id", authenticateToken, deleteBoard);

export default router;
