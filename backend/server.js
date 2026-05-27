import express from "express";
import cors from "cors";
import { prisma } from "./src/lib/prisma.js";
import authRoutes from './src/routes/authRoutes.js'
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/api/health", async (req, res) => {
  const users = await prisma.user.count();

  res.json({
    message: "API running",
    users,
  });
});

app.use("/api/auth", authRoutes);