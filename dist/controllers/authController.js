"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['ADMIN']).default('ADMIN'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const { name, email, password, role } = parsed.data;
        // Check if user exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const { email, password } = parsed.data;
        // Find user
        const user = yield prisma.user.findUnique({
            where: { email },
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
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Prepare profile
        let profile = null;
        if (user.role === 'ADMIN')
            profile = user.adminProfile;
        if (user.role === 'INSTRUCTOR')
            profile = user.instructorProfile;
        if (user.role === 'STUDENT')
            profile = user.studentProfile;
        // Generate tokens
        const payload = { id: user.id, email: user.email, role: user.role };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logout logic will go here
    res.json({ message: 'Logout endpoint' });
});
exports.logout = logout;
