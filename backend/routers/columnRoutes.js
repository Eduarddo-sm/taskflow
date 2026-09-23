import express from "express";
import { authenticateToken} from "../middlewares/authMiddleware.js";

import { createColumn, updateColumn } from "../controllers/columnController.js";

const router = express.Router();

router.post("/boards/:boardId/columns", authenticateToken, createColumn);
router.patch ("/columns/:columnId", authenticateToken, updateColumn);

export default router;