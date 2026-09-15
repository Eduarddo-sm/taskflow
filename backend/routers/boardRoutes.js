import express from "express";
import { listBoards, selectBoard, createBoard } from "../controllers/boardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Listar os boards
router.get("/", authenticateToken, listBoards);

//Selecionar um board e retornar seu conteudo
router.get("/:boardId", authenticateToken, selectBoard);

//Criar um board
router.post("/", authenticateToken, createBoard);

//router.put("/:boardId", authenticateToken, putBoard);
//router.delete("/:boardId", authenticateToken, deleteBoard);


export default router;
