import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { createActivity } from "../lib/activity.js";

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

        await createActivity({
            userId: req.user.id,
            action: "created",
            entityType: "client",
            entityName: client.name,
        });

        res.status(201).json({ client });
    } catch (error) {
        console.log("CREATE CLIENT ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/stats", async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: {
                userId: req.user.id,
            },
        });

        const totalClients = clients.length;
        const leads = clients.filter((client) => client.status === "lead").length;
        const contacted = clients.filter(
            (client) => client.status === "contacted"
        ).length;
        const activeClients = clients.filter(
            (client) => client.status === "client"
        ).length;

        const estimatedRevenue = clients.reduce(
            (sum, client) => sum + client.value,
            0
        );

        res.json({
            totalClients,
            leads,
            contacted,
            activeClients,
            estimatedRevenue,
        });
    } catch (error) {
        console.log("CLIENT STATS ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      client,
    });
  } catch (error) {
    console.log("GET CLIENT ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, email, phone, status, value, notes } = req.body;

        const existingClient = await prisma.client.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!existingClient) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        const client = await prisma.client.update({
            where: { id },
            data: {
                name,
                company,
                email,
                phone,
                status,
                value: Number(value) || 0,
                notes,
            },
        });

        await createActivity({
            userId: req.user.id,
            action: "updated",
            entityType: "client",
            entityName: client.name,
        });

        res.json({
            message: "Client updated successfully",
            client,
        });
    } catch (error) {
        console.log("UPDATE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const client = await prisma.client.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        await prisma.client.delete({
            where: {
                id,
            },
        });

        await createActivity({
            userId: req.user.id,
            action: "deleted",
            entityType: "client",
            entityName: client.name,
        });

        res.json({
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.log("DELETE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});

export default router;