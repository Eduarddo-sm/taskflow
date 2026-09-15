import express from "express";
import { listBoards, selectBoard, createBoard, putBoard, deleteBoard } from "../controllers/boardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, listBoards);
router.get("/:boardId", authenticateToken, selectBoard);
router.post("/", authenticateToken, createBoard);
router.put("/:boardId", authenticateToken, putBoard);
router.delete("/:boardId", authenticateToken, deleteBoard);

export default router;
