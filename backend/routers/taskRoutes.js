import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createTask, editTask } from "../controllers/taskController.js";


const router = express.Router();

router.post("/columns/:columnId/tasks", authenticateToken, createTask);
router.patch("/tasks/:taskId", authenticateToken, editTask);


export default router;