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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma_1.default.category.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prisma_1.default.category.findUnique({ where: { id } });
        if (!category)
            return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, status } = req.body;
        const category = yield prisma_1.default.category.create({
            data: { name, description, status },
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        const category = yield prisma_1.default.category.update({
            where: { id },
            data: { name, description, status },
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.category.delete({ where: { id } });
        res.json({ message: 'Category deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCategory = deleteCategory;
