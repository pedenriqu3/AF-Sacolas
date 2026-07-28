import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "af_sacolas_secret_key_2026";

const createOrderSchema = z.object({
  bagType: z.string(),
  bagColors: z.union([z.string(), z.array(z.string())]),
  logoColors: z.union([z.string(), z.array(z.string())]),
  handleType: z.string(),
  handleColor: z.string(),
  size: z.string(),
  quantity: z.number().positive(),
  logoFront: z.boolean().optional(),
  logoBack: z.boolean().optional(),
  totalAmount: z.number().nonnegative(),
  shippingAddr: z.string().optional(),
});

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ ok: false, error: "Faça login para realizar o pedido." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstErr = parseResult.error.errors[0]?.message || "Dados de pedido inválidos.";
      res.status(400).json({ ok: false, error: firstErr });
      return;
    }

    const data = parseResult.data;

    const bagColorsStr = Array.isArray(data.bagColors) ? data.bagColors.join(", ") : data.bagColors;
    const logoColorsStr = Array.isArray(data.logoColors) ? data.logoColors.join(", ") : data.logoColors;

    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        bagType: data.bagType,
        bagColors: bagColorsStr,
        logoColors: logoColorsStr,
        handleType: data.handleType,
        handleColor: data.handleColor,
        size: data.size,
        quantity: data.quantity,
        logoFront: data.logoFront ?? true,
        logoBack: data.logoBack ?? false,
        totalAmount: data.totalAmount,
        shippingAddr: data.shippingAddr || null,
        status: "Pendente",
      },
    });

    res.status(201).json({ ok: true, order });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ ok: false, error: "Erro ao registrar o pedido no servidor." });
  }
}

export async function getUserOrders(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ ok: false, error: "Não autorizado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ ok: true, orders });
  } catch (err) {
    console.error("Erro ao buscar histórico de pedidos:", err);
    res.status(500).json({ ok: false, error: "Erro ao buscar histórico de pedidos." });
  }
}
