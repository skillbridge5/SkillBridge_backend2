import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN']).default('ADMIN'),
});

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    const { name, email, password, role } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // use string
        adminProfile: { create: {} },
      },
      include: { adminProfile: true },
    });

    return res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  // Login logic will go here
  res.json({ message: 'Login endpoint' });
};

export const logout = async (req: Request, res: Response) => {
  // Logout logic will go here
  res.json({ message: 'Logout endpoint' });
}; 