import express from "express";
import { authenticateToken} from "../middlewares/authMiddleware.js";

import { createColumn, updateColumn, deleteColumn } from "../controllers/columnController.js";

const router = express.Router();

router.post("/boards/:boardId/columns", authenticateToken, createColumn);
router.patch ("/columns/:columnId", authenticateToken, updateColumn);
router.delete("/columns/:columnId", authenticateToken, deleteColumn);

export default router;