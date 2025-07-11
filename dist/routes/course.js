"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const courseController_1 = require("../controllers/courseController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', authMiddleware_1.authenticateJWT, courseController_1.getAllCourses);
/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course object
 *       404:
 *         description: Course not found
 */
router.get('/:id', authMiddleware_1.authenticateJWT, courseController_1.getCourseById);
/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - detailedDescription
 *               - priceOriginal
 *               - priceDiscounted
 *               - status
 *               - level
 *               - duration
 *               - categoryId
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               detailedDescription:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               priceOriginal:
 *                 type: number
 *               priceDiscounted:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *               duration:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               instructorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', authMiddleware_1.authenticateJWT, courseController_1.createCourse);
/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - detailedDescription
 *               - priceOriginal
 *               - priceDiscounted
 *               - status
 *               - level
 *               - duration
 *               - categoryId
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               detailedDescription:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               priceOriginal:
 *                 type: number
 *               priceDiscounted:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *               duration:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               instructorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 */
router.put('/:id', authMiddleware_1.authenticateJWT, courseController_1.updateCourse);
/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete('/:id', authMiddleware_1.authenticateJWT, courseController_1.deleteCourse);
/**
 * @swagger
 * /api/courses/{courseId}/modules:
 *   get:
 *     summary: Get modules for a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of modules
 */
router.get('/:courseId/modules', authMiddleware_1.authenticateJWT, courseController_1.getModulesByCourse);
/**
 * @swagger
 * /api/courses/modules:
 *   post:
 *     summary: Create a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *               - duration
 *               - order
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               duration:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Module created
 */
router.post('/modules', authMiddleware_1.authenticateJWT, courseController_1.createModule);
/**
 * @swagger
 * /api/courses/modules/{id}:
 *   put:
 *     summary: Update a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Module updated
 */
router.put('/modules/:id', authMiddleware_1.authenticateJWT, courseController_1.updateModule);
/**
 * @swagger
 * /api/courses/modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module deleted
 */
router.delete('/modules/:id', authMiddleware_1.authenticateJWT, courseController_1.deleteModule);
/**
 * @swagger
 * /api/courses/modules/{moduleId}/lessons:
 *   get:
 *     summary: Get lessons for a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get('/modules/:moduleId/lessons', authMiddleware_1.authenticateJWT, courseController_1.getLessonsByModule);
/**
 * @swagger
 * /api/courses/lessons:
 *   post:
 *     summary: Create a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - title
 *               - duration
 *               - order
 *             properties:
 *               moduleId:
 *                 type: string
 *               title:
 *                 type: string
 *               duration:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lesson created
 */
router.post('/lessons', authMiddleware_1.authenticateJWT, courseController_1.createLesson);
/**
 * @swagger
 * /api/courses/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson updated
 */
router.put('/lessons/:id', authMiddleware_1.authenticateJWT, courseController_1.updateLesson);
/**
 * @swagger
 * /api/courses/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted
 */
router.delete('/lessons/:id', authMiddleware_1.authenticateJWT, courseController_1.deleteLesson);
/**
 * @swagger
 * /api/courses/{courseId}/learning-outcomes:
 *   get:
 *     summary: Get learning outcomes for a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of learning outcomes
 */
router.get('/:courseId/learning-outcomes', authMiddleware_1.authenticateJWT, courseController_1.getLearningOutcomesByCourse);
/**
 * @swagger
 * /api/courses/learning-outcomes:
 *   post:
 *     summary: Create a learning outcome
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - text
 *             properties:
 *               courseId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Learning outcome created
 */
router.post('/learning-outcomes', authMiddleware_1.authenticateJWT, courseController_1.createLearningOutcome);
/**
 * @swagger
 * /api/courses/learning-outcomes/{id}:
 *   put:
 *     summary: Update a learning outcome
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Learning outcome updated
 */
router.put('/learning-outcomes/:id', authMiddleware_1.authenticateJWT, courseController_1.updateLearningOutcome);
/**
 * @swagger
 * /api/courses/learning-outcomes/{id}:
 *   delete:
 *     summary: Delete a learning outcome
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning outcome deleted
 */
router.delete('/learning-outcomes/:id', authMiddleware_1.authenticateJWT, courseController_1.deleteLearningOutcome);
/**
 * @swagger
 * /api/courses/{courseId}/prerequisites:
 *   get:
 *     summary: Get prerequisites for a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of prerequisites
 */
router.get('/:courseId/prerequisites', authMiddleware_1.authenticateJWT, courseController_1.getPrerequisitesByCourse);
/**
 * @swagger
 * /api/courses/prerequisites:
 *   post:
 *     summary: Create a prerequisite
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - text
 *             properties:
 *               courseId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prerequisite created
 */
router.post('/prerequisites', authMiddleware_1.authenticateJWT, courseController_1.createPrerequisite);
/**
 * @swagger
 * /api/courses/prerequisites/{id}:
 *   put:
 *     summary: Update a prerequisite
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prerequisite updated
 */
router.put('/prerequisites/:id', authMiddleware_1.authenticateJWT, courseController_1.updatePrerequisite);
/**
 * @swagger
 * /api/courses/prerequisites/{id}:
 *   delete:
 *     summary: Delete a prerequisite
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prerequisite deleted
 */
router.delete('/prerequisites/:id', authMiddleware_1.authenticateJWT, courseController_1.deletePrerequisite);
exports.default = router;
