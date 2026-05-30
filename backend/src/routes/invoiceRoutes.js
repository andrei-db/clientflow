import express from "express";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { createActivity } from "../lib/activity.js";

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ invoices });
  } catch (error) {
    console.log("GET INVOICES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { number, amount, status, dueDate, clientId } = req.body;

    if (!number || !amount || !clientId) {
      return res.status(400).json({
        message: "Number, amount and client are required",
      });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: req.user.id,
      },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        number,
        amount: Number(amount),
        status: status || "draft",
        dueDate: dueDate ? new Date(dueDate) : null,
        clientId,
        userId: req.user.id,
      },
      include: {
        client: true,
      },
    });

    await createActivity({
      userId: req.user.id,
      action: "created",
      entityType: "invoice",
      entityName: invoice.number,
    });

    res.status(201).json({ invoice });
  } catch (error) {
    console.log("CREATE INVOICE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;