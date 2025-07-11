import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  getModulesByCourse, createModule, updateModule, deleteModule,
  getLessonsByModule, createLesson, updateLesson, deleteLesson,
  getLearningOutcomesByCourse, createLearningOutcome, updateLearningOutcome, deleteLearningOutcome,
  getPrerequisitesByCourse, createPrerequisite, updatePrerequisite, deletePrerequisite
} from '../controllers/courseController';

const router = Router();

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
router.get('/', authenticateJWT, getAllCourses);

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
router.get('/:id', authenticateJWT, getCourseById);

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
router.post('/', authenticateJWT, createCourse);

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
router.put('/:id', authenticateJWT, updateCourse);

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
router.delete('/:id', authenticateJWT, deleteCourse);

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
router.get('/:courseId/modules', authenticateJWT, getModulesByCourse);

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
router.post('/modules', authenticateJWT, createModule);

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
router.put('/modules/:id', authenticateJWT, updateModule);

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
router.delete('/modules/:id', authenticateJWT, deleteModule);

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
router.get('/modules/:moduleId/lessons', authenticateJWT, getLessonsByModule);

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
router.post('/lessons', authenticateJWT, createLesson);

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
router.put('/lessons/:id', authenticateJWT, updateLesson);

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
router.delete('/lessons/:id', authenticateJWT, deleteLesson);

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
router.get('/:courseId/learning-outcomes', authenticateJWT, getLearningOutcomesByCourse);

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
router.post('/learning-outcomes', authenticateJWT, createLearningOutcome);

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
router.put('/learning-outcomes/:id', authenticateJWT, updateLearningOutcome);

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
router.delete('/learning-outcomes/:id', authenticateJWT, deleteLearningOutcome);

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
router.get('/:courseId/prerequisites', authenticateJWT, getPrerequisitesByCourse);

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
router.post('/prerequisites', authenticateJWT, createPrerequisite);

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
router.put('/prerequisites/:id', authenticateJWT, updatePrerequisite);

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
router.delete('/prerequisites/:id', authenticateJWT, deletePrerequisite);

export default router; 