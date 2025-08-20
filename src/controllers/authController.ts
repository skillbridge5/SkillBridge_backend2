import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN']).default('ADMIN'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    const { name, email, password, role } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
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
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        adminProfile: true,
        instructorProfile: true,
        studentProfile: true,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Prepare profile
    let profile = null;
    if (user.role === 'ADMIN') profile = user.adminProfile;
    if (user.role === 'INSTRUCTOR') profile = user.instructorProfile;
    if (user.role === 'STUDENT') profile = user.studentProfile;

    // Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '10h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Logout logic will go here
  res.json({ message: 'Logout endpoint' });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const secret = process.env.JWT_SECRET as string;
    let payload;
    try {
      payload = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    // Issue new access token
    const newAccessToken = jwt.sign({ id: payload.id, email: payload.email, role: payload.role }, secret, { expiresIn: '10h' });
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/auth/register-student:
 *   post:
 *     summary: Register a new student user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Student User
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       201:
 *         description: Student registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
// Student Registration
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
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
        role: 'STUDENT',
        studentProfile: { create: {} }
      }
    });
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    res.status(201).json({ message: 'Student registered', user: { ...user, studentProfile } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/auth/login-student:
 *   post:
 *     summary: Login a student user and get tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
// Student Login
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.role !== 'STUDENT') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '10h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    const studentProfileLogin = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: studentProfileLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 