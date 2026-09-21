import express from "express";
import { listBoards, selectBoard, createBoard, updateBoard, deleteBoard } from "../controllers/boardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, listBoards);
router.get("/:boardId", authenticateToken, selectBoard);
router.post("/", authenticateToken, createBoard);
router.patch("/:boardId", authenticateToken, updateBoard);
router.delete("/:boardId", authenticateToken, deleteBoard);


export default router;
