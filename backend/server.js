import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./src/routes/authRoutes.js";
import clientRoutes from "./src/routes/clientRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});