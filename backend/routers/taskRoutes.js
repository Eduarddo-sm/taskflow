import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createTask } from "../controllers/taskController.js";


const router = express.Router();

router.post("/columns/:columnId/tasks", authenticateToken, createTask);


export default router;