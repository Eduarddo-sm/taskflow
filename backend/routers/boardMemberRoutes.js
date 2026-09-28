import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { addMember, listMembers, changeMemberPermission, deleteMember } from "../controllers/boardMemberController.js";

const router = express.Router();


router.post("/:boardId/members", authenticateToken, addMember);
router.get("/:boardId/members", authenticateToken, listMembers);
router.patch("/:boardId/members/:memberUserId", authenticateToken, changeMemberPermission);
router.delete("/:boardId/members/:memberUserId", authenticateToken, deleteMember);

export default router;