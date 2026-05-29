import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { createActivity } from "../lib/activity.js";

const router = express.Router();

router.use(authRequired);

router.post("/", async (req, res) => {
  try {
    const { title, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        message: "Title and project are required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId,
        userId: req.user.id,
      },
    });

    await createActivity({
      userId: req.user.id,
      action: "created",
      entityType: "task",
      entityName: task.title,
    });

    res.status(201).json({ task });
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        status,
      },
    });

    res.json({ task });
  } catch (error) {
    console.log("UPDATE TASK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TASK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;