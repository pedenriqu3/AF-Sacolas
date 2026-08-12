import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "af_sacolas_secret_key_2026";

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(3, "Escreva uma mensagem com pelo menos 3 caracteres."),
});

export async function listFeedbacks(_req: Request, res: Response): Promise<void> {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.json({
      ok: true,
      feedbacks: feedbacks.map((feedback) => ({
        id: feedback.id,
        name: feedback.user.name,
        role: "Cliente cadastrado",
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt,
      })),
    });
  } catch (err) {
    console.error("Erro ao buscar feedbacks:", err);
    res.status(500).json({ ok: false, error: "Erro ao buscar feedbacks." });
  }
}

export async function createFeedback(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ ok: false, error: "Faça login para enviar um feedback." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const parseResult = feedbackSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Feedback inválido.";
      res.status(400).json({ ok: false, error: firstError });
      return;
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: decoded.userId,
        rating: parseResult.data.rating,
        message: parseResult.data.message,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.status(201).json({
      ok: true,
      feedback: {
        id: feedback.id,
        name: feedback.user.name,
        role: "Cliente cadastrado",
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt,
      },
    });
  } catch (err) {
    console.error("Erro ao criar feedback:", err);
    res.status(500).json({ ok: false, error: "Erro ao publicar feedback." });
  }
}