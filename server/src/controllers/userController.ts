import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "af_sacolas_secret_key_2026";

const addressSchema = z.object({
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export async function updateAddress(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ ok: false, error: "Não autorizado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const parseResult = addressSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ ok: false, error: "Dados de endereço inválidos" });
      return;
    }

    const addressData = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        zipCode: addressData.zipCode || null,
        street: addressData.street || null,
        number: addressData.number || null,
        complement: addressData.complement || null,
        neighborhood: addressData.neighborhood || null,
        city: addressData.city || null,
        state: addressData.state || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        zipCode: true,
        street: true,
        number: true,
        complement: true,
        neighborhood: true,
        city: true,
        state: true,
      },
    });

    res.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error("Erro ao atualizar endereço:", err);
    res.status(500).json({ ok: false, error: "Erro ao atualizar endereço." });
  }
}
