import express from "express";
import authRoutes from "./routers/authRoutes.js";
import boardRoutes from "./routers/boardRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);


export default app;