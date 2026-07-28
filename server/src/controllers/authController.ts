import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "af_sacolas_secret_key_2026";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  phone: z.string().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dados inválidos";
      res.status(400).json({ ok: false, error: firstError });
      return;
    }

    const { name, email, phone, password } = parseResult.data;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(400).json({
        ok: false,
        error: "Já existe uma conta cadastrada com este e-mail.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
      },
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ ok: false, error: "Erro interno ao cadastrar usuário." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dados inválidos";
      res.status(400).json({ ok: false, error: firstError });
      return;
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(400).json({ ok: false, error: "E-mail ou senha inválidos." });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(400).json({ ok: false, error: "E-mail ou senha inválidos." });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ ok: false, error: "Erro interno ao realizar login." });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ ok: false, error: "Não autorizado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ ok: false, error: "Usuário não encontrado" });
      return;
    }

    res.json({ ok: true, user });
  } catch {
    res.status(401).json({ ok: false, error: "Token inválido ou expirado" });
  }
}
