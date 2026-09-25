import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { addMember } from "../controllers/boardMemberController.js";

const router = express.Router();


router.post("/:boardId/members", authenticateToken, addMember);


export default router;