import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    res.json({
      activities,
    });
  } catch (error) {
    console.log("GET ACTIVITIES ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;