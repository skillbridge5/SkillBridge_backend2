import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../config/prisma';
import { Parser } from 'json2csv';

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];

const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'SUPER_ADMIN', 'SUPPORT']).default('ADMIN'),
  status: z.string().optional(),
});

const adminUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN', 'SUPPORT']).optional(),
  status: z.string().optional(),
});

// List & search admin users
export const listAdmins = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const where: any = {
      role: { in: adminRoles },
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const admins = await prisma.user.findMany({
      where,
      include: { adminProfile: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create new admin user
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const parsed = adminCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    const { name, email, password, role, status } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        status: status || 'ACTIVE',
        adminProfile: { create: {} },
      },
      include: { adminProfile: true },
    });
    res.status(201).json({ message: 'Admin user created', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Edit admin user
export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = adminUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    const data: any = { ...parsed.data };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // Only allow updating admin roles
    if (data.role && !adminRoles.includes(data.role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      include: { adminProfile: true },
    });
    res.json({ message: 'Admin user updated', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete admin user
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First delete the admin profile, then the user
    await prisma.$transaction(async (tx) => {
      // Delete admin profile first
      await tx.adminProfile.deleteMany({
        where: { userId: id }
      });
      
      // Then delete the user
      await tx.user.delete({ where: { id } });
    });
    
    res.json({ message: 'Admin user deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 