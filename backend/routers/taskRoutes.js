import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createTask, editTask, deleteTask } from "../controllers/taskController.js";


const router = express.Router();

router.post("/columns/:columnId/tasks", authenticateToken, createTask);
router.patch("/tasks/:taskId", authenticateToken, editTask);
router.delete("/tasks/:taskId", authenticateToken, deleteTask);



export default router;