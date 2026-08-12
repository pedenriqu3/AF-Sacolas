import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { userSelect } from "../utils/userSelect.js";

const JWT_SECRET = process.env.JWT_SECRET || "af_sacolas_secret_key_2026";

const addressSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

async function updateUserProfile(req: Request, res: Response): Promise<void> {
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

    if (addressData.email) {
      const normalizedEmail = addressData.email.trim().toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser && existingUser.id !== decoded.userId) {
        res.status(400).json({ ok: false, error: "Já existe uma conta cadastrada com este e-mail." });
        return;
      }

      addressData.email = normalizedEmail;
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(addressData.name ? { name: addressData.name.trim() } : {}),
        ...(addressData.email ? { email: addressData.email } : {}),
        ...(addressData.phone !== undefined ? { phone: addressData.phone.trim() || null } : {}),
        zipCode: addressData.zipCode || null,
        street: addressData.street || null,
        number: addressData.number || null,
        complement: addressData.complement || null,
        neighborhood: addressData.neighborhood || null,
        city: addressData.city || null,
        state: addressData.state || null,
      },
      select: userSelect,
    });

    res.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error("Erro ao atualizar endereço:", err);
    res.status(500).json({ ok: false, error: "Erro ao atualizar endereço." });
  }
}

export async function updateAddress(req: Request, res: Response): Promise<void> {
  return updateUserProfile(req, res);
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  return updateUserProfile(req, res);
}
