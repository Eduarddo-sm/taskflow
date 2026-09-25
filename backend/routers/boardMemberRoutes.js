import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { addMember, listMembers } from "../controllers/boardMemberController.js";

const router = express.Router();


router.post("/:boardId/members", authenticateToken, addMember);
router.get("/:boardId/members", authenticateToken, listMembers)


export default router;