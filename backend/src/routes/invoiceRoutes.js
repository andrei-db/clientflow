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
router.get("/stats", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const totalInvoices = invoices.length;
    const draft = invoices.filter((i) => i.status === "draft").length;
    const sent = invoices.filter((i) => i.status === "sent").length;
    const paid = invoices.filter((i) => i.status === "paid").length;
    const overdue = invoices.filter((i) => i.status === "overdue").length;

    const totalRevenue = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    const outstanding = invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    res.json({
      totalInvoices,
      draft,
      sent,
      paid,
      overdue,
      totalRevenue,
      outstanding,
    });
  } catch (error) {
    console.log("INVOICE STATS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { number, amount, status, dueDate, clientId } = req.body;

    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        number,
        amount: Number(amount) || 0,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        clientId,
      },
      include: {
        client: true,
      },
    });

    res.json({ invoice });
  } catch (error) {
    console.log("UPDATE INVOICE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.log("DELETE INVOICE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;