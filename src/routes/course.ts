import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getAllCourses, getCourseById, createCourseWithDetails, updateCourseWithDetails, deleteCourse
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
 *     summary: Get all courses with complete details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses with modules, lessons, outcomes, and prerequisites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   shortDescription:
 *                     type: string
 *                   detailedDescription:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   priceOriginal:
 *                     type: number
 *                   priceDiscounted:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [DRAFT, PUBLISHED]
 *                   level:
 *                     type: string
 *                     enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *                   duration:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *                   instructorId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE, INACTIVE]
 *                   instructor:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                   modules:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         duration:
 *                           type: string
 *                         order:
 *                           type: integer
 *                         lessons:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               duration:
 *                                 type: string
 *                               order:
 *                                 type: integer
 *                   learningOutcomes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         text:
 *                           type: string
 *                   prerequisites:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         text:
 *                           type: string
 */
router.get('/', authenticateJWT, getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID with complete details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course object with all related data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 detailedDescription:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 priceOriginal:
 *                   type: number
 *                 priceDiscounted:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: [DRAFT, PUBLISHED]
 *                 level:
 *                   type: string
 *                   enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *                 duration:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 instructorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [ACTIVE, INACTIVE]
 *                 instructor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       order:
 *                         type: integer
 *                       lessons:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             duration:
 *                               type: string
 *                             order:
 *                               type: integer
 *                 learningOutcomes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *       404:
 *         description: Course not found
 */
router.get('/:id', authenticateJWT, getCourseById);

/**
 * @swagger
 * /api/courses/comprehensive:
 *   post:
 *     summary: Create a new course with all details (modules, lessons, outcomes, prerequisites)
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
 *               - level
 *               - duration
 *               - categoryId
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete Web Development Bootcamp"
 *               shortDescription:
 *                 type: string
 *                 example: "Learn HTML, CSS, JavaScript, React, Node.js and more"
 *               detailedDescription:
 *                 type: string
 *                 example: "This comprehensive course is designed to take you from beginner to professional in web development..."
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/course-image.jpg"
 *               priceOriginal:
 *                 type: number
 *                 example: 99.99
 *               priceDiscounted:
 *                 type: number
 *                 example: 79.99
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *                 default: DRAFT
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *                 example: BEGINNER
 *               duration:
 *                 type: string
 *                 example: "48 hours"
 *               categoryId:
 *                 type: string
 *                 example: "category-uuid"
 *               instructorId:
 *                 type: string
 *                 example: "instructor-uuid"
 *               slug:
 *                 type: string
 *                 example: "web-development-bootcamp"
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               reviews:
 *                 type: number
 *                 example: 1245
 *               students:
 *                 type: number
 *                 example: 15000
 *               enrollmentYear:
 *                 type: number
 *                 example: 2025
 *               learningOutcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Build 16+ web development projects", "Learn HTML5, CSS3, JavaScript"]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic computer skills", "No prior programming experience required"]
 *               curriculum:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Introduction to Web Development"
 *                     duration:
 *                       type: string
 *                       example: "3 hours"
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Course Overview"
 *                           duration:
 *                             type: string
 *                             example: "15 min"
 *     responses:
 *       201:
 *         description: Course created with all details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 detailedDescription:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 priceOriginal:
 *                   type: number
 *                 priceDiscounted:
 *                   type: number
 *                 status:
 *                   type: string
 *                 level:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 instructorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: object
 *                 instructor:
 *                   type: object
 *                 modules:
 *                   type: array
 *                 learningOutcomes:
 *                   type: array
 *                 prerequisites:
 *                   type: array
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/comprehensive', authenticateJWT, createCourseWithDetails);

/**
 * @swagger
 * /api/courses/{id}/comprehensive:
 *   put:
 *     summary: Update a course with all details (modules, lessons, outcomes, prerequisites)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *               - level
 *               - duration
 *               - categoryId
 *               - instructorId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete Web Development Bootcamp"
 *               shortDescription:
 *                 type: string
 *                 example: "Learn HTML, CSS, JavaScript, React, Node.js and more"
 *               detailedDescription:
 *                 type: string
 *                 example: "This comprehensive course is designed to take you from beginner to professional in web development..."
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/course-image.jpg"
 *               priceOriginal:
 *                 type: number
 *                 example: 99.99
 *               priceDiscounted:
 *                 type: number
 *                 example: 79.99
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS]
 *                 example: BEGINNER
 *               duration:
 *                 type: string
 *                 example: "48 hours"
 *               categoryId:
 *                 type: string
 *                 example: "category-uuid"
 *               instructorId:
 *                 type: string
 *                 example: "instructor-uuid"
 *               slug:
 *                 type: string
 *                 example: "web-development-bootcamp"
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               reviews:
 *                 type: number
 *                 example: 1245
 *               students:
 *                 type: number
 *                 example: 15000
 *               enrollmentYear:
 *                 type: number
 *                 example: 2025
 *               learningOutcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Build 16+ web development projects", "Learn HTML5, CSS3, JavaScript"]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic computer skills", "No prior programming experience required"]
 *               curriculum:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Introduction to Web Development"
 *                     duration:
 *                       type: string
 *                       example: "3 hours"
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Course Overview"
 *                           duration:
 *                             type: string
 *                             example: "15 min"
 *     responses:
 *       200:
 *         description: Course updated with all details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 detailedDescription:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 priceOriginal:
 *                   type: number
 *                 priceDiscounted:
 *                   type: number
 *                 status:
 *                   type: string
 *                 level:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 instructorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: object
 *                 instructor:
 *                   type: object
 *                 modules:
 *                   type: array
 *                 learningOutcomes:
 *                   type: array
 *                 prerequisites:
 *                   type: array
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/:id/comprehensive', authenticateJWT, updateCourseWithDetails);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course and all related data
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course and all related data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course deleted"
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateJWT, deleteCourse);

export default router; 