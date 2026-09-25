import express from "express";
import authRoutes from "./routers/authRoutes.js";
import boardRoutes from "./routers/boardRoutes.js";
import taskRoutes from "./routers/taskRoutes.js";
import columnRoutes from "./routers/columnRoutes.js";
import boardMemberRoutes from "./routers/boardMemberRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api", taskRoutes);
app.use("/api", columnRoutes);
app.use("/api/boards", boardMemberRoutes);

export default app;