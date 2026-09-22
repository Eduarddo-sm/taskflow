import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

import { createColumn } from "../controllers/columnController.js";

const router = express.Router();

router.post("/boards/:boardId/columns", authenticateToken, createColumn);


export default router;