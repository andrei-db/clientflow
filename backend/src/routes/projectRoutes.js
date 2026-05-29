import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({ projects });
    } catch (error) {
        console.log("GET PROJECTS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, status, budget, deadline } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Project title is required",
            });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                status: status || "planned",
                budget: Number(budget) || 0,
                deadline: deadline ? new Date(deadline) : null,
                userId: req.user.id,
            },
        });

        await createActivity({
            userId: req.user.id,
            action: "created",
            entityType: "project",
            entityName: project.title,
        });

        res.status(201).json({
            message: "Project created",
            project,
        });
    } catch (error) {
        console.log("CREATE PROJECT ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/stats", async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: req.user.id,
            },
        });

        const totalProjects = projects.length;
        const planned = projects.filter((p) => p.status === "planned").length;
        const inProgress = projects.filter((p) => p.status === "in_progress").length;
        const completed = projects.filter((p) => p.status === "completed").length;

        const totalBudget = projects.reduce((sum, project) => {
            return sum + project.budget;
        }, 0);

        res.json({
            totalProjects,
            planned,
            inProgress,
            completed,
            totalBudget,
        });
    } catch (error) {
        console.log("PROJECT STATS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, budget, deadline } = req.body;

        const existingProject = await prisma.project.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const project = await prisma.project.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                status,
                budget: Number(budget) || 0,
                deadline: deadline ? new Date(deadline) : null,
            },
        });

        await createActivity({
            userId: req.user.id,
            action: "updated",
            entityType: "project",
            entityName: project.title,
        });

        res.json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.log("UPDATE PROJECT ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        await prisma.project.delete({
            where: {
                id,
            },
        });

        await createActivity({
            userId: req.user.id,
            action: "deleted",
            entityType: "project",
            entityName: project.title,
        });

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.log("DELETE PROJECT ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});
export default router;