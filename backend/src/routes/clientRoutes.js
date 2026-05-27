import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ clients });
  } catch (error) {
    console.log("GET CLIENTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, company, email, phone, status, value, notes } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({
        message: "Name, company and email are required",
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        company,
        email,
        phone,
        status,
        value: Number(value) || 0,
        notes,
        userId: req.user.id,
      },
    });

    res.status(201).json({ client });
  } catch (error) {
    console.log("CREATE CLIENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;