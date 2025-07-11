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
exports.deletePrerequisite = exports.updatePrerequisite = exports.createPrerequisite = exports.getPrerequisitesByCourse = exports.deleteLearningOutcome = exports.updateLearningOutcome = exports.createLearningOutcome = exports.getLearningOutcomesByCourse = exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLessonsByModule = exports.deleteModule = exports.updateModule = exports.createModule = exports.getModulesByCourse = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// --- Course ---
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma_1.default.course.findMany({ include: { category: true, instructor: true, modules: true, learningOutcomes: true, prerequisites: true } });
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllCourses = getAllCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield prisma_1.default.course.findUnique({ where: { id }, include: { category: true, instructor: true, modules: { include: { lessons: true } }, learningOutcomes: true, prerequisites: true } });
        if (!course)
            return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCourseById = getCourseById;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId } = req.body;
        const course = yield prisma_1.default.course.create({
            data: { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId },
        });
        res.status(201).json(course);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId } = req.body;
        const course = yield prisma_1.default.course.update({
            where: { id },
            data: { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId },
        });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.course.delete({ where: { id } });
        res.json({ message: 'Course deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCourse = deleteCourse;
// --- CourseModule ---
const getModulesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const modules = yield prisma_1.default.courseModule.findMany({ where: { courseId }, include: { lessons: true } });
        res.json(modules);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getModulesByCourse = getModulesByCourse;
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, title, duration, order } = req.body;
        const module = yield prisma_1.default.courseModule.create({ data: { courseId, title, duration, order } });
        res.status(201).json(module);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createModule = createModule;
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, duration, order } = req.body;
        const module = yield prisma_1.default.courseModule.update({ where: { id }, data: { title, duration, order } });
        res.json(module);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateModule = updateModule;
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.courseModule.delete({ where: { id } });
        res.json({ message: 'Module deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteModule = deleteModule;
// --- CourseLesson ---
const getLessonsByModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId } = req.params;
        const lessons = yield prisma_1.default.courseLesson.findMany({ where: { moduleId } });
        res.json(lessons);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLessonsByModule = getLessonsByModule;
const createLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId, title, duration, order } = req.body;
        const lesson = yield prisma_1.default.courseLesson.create({ data: { moduleId, title, duration, order } });
        res.status(201).json(lesson);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createLesson = createLesson;
const updateLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, duration, order } = req.body;
        const lesson = yield prisma_1.default.courseLesson.update({ where: { id }, data: { title, duration, order } });
        res.json(lesson);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateLesson = updateLesson;
const deleteLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.courseLesson.delete({ where: { id } });
        res.json({ message: 'Lesson deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteLesson = deleteLesson;
// --- LearningOutcome ---
const getLearningOutcomesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const outcomes = yield prisma_1.default.learningOutcome.findMany({ where: { courseId } });
        res.json(outcomes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLearningOutcomesByCourse = getLearningOutcomesByCourse;
const createLearningOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, text } = req.body;
        const outcome = yield prisma_1.default.learningOutcome.create({ data: { courseId, text } });
        res.status(201).json(outcome);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createLearningOutcome = createLearningOutcome;
const updateLearningOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const outcome = yield prisma_1.default.learningOutcome.update({ where: { id }, data: { text } });
        res.json(outcome);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateLearningOutcome = updateLearningOutcome;
const deleteLearningOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.learningOutcome.delete({ where: { id } });
        res.json({ message: 'Learning outcome deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteLearningOutcome = deleteLearningOutcome;
// --- Prerequisite ---
const getPrerequisitesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const prerequisites = yield prisma_1.default.prerequisite.findMany({ where: { courseId } });
        res.json(prerequisites);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPrerequisitesByCourse = getPrerequisitesByCourse;
const createPrerequisite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, text } = req.body;
        const prerequisite = yield prisma_1.default.prerequisite.create({ data: { courseId, text } });
        res.status(201).json(prerequisite);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createPrerequisite = createPrerequisite;
const updatePrerequisite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const prerequisite = yield prisma_1.default.prerequisite.update({ where: { id }, data: { text } });
        res.json(prerequisite);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updatePrerequisite = updatePrerequisite;
const deletePrerequisite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.default.prerequisite.delete({ where: { id } });
        res.json({ message: 'Prerequisite deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deletePrerequisite = deletePrerequisite;
