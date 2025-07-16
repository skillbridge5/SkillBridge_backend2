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
 *                 example: "Learn HTML, CSS, JavaScript, React, Node.js and more to become a full-stack web developer"
 *               detailedDescription:
 *                 type: string
 *                 example: "This comprehensive course is designed to take you from beginner to professional in web development. You'll learn front-end and back-end technologies, build real-world projects, and gain the skills needed to land your first developer job or freelance clients."
 *               imageUrl:
 *                 type: string
 *                 example: null
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
 *                 example: ALL_LEVELS
 *               duration:
 *                 type: string
 *                 example: "48 hours"
 *               categoryId:
 *                 type: string
 *                 example: "3ac0ac14-3200-473b-9411-a485f7c23518"
 *               instructorId:
 *                 type: string
 *                 example: "21fc9a45-aaa3-421f-a730-796d6b7be9b5"
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
 *                 example:
 *                   - "Build 16+ web development projects for your portfolio"
 *                   - "Learn HTML5, CSS3, JavaScript, React, Node.js, MongoDB, and more"
 *                   - "Create a full-stack web application from scratch"
 *                   - "Understand how to connect and work with databases"
 *                   - "Deploy your applications to production"
 *                   - "Learn professional developer best practices"
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "Basic computer skills"
 *                   - "No prior programming experience required"
 *                   - "A computer with internet access"
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
 *                   example: "4afae000-b3db-4bfb-b9f2-7cc22cfbbc80"
 *                 title:
 *                   type: string
 *                   example: "Complete Web Development Bootcamp"
 *                 shortDescription:
 *                   type: string
 *                   example: "Learn HTML, CSS, JavaScript, React, Node.js and more to become a full-stack web developer"
 *                 detailedDescription:
 *                   type: string
 *                   example: "This comprehensive course is designed to take you from beginner to professional in web development. You'll learn front-end and back-end technologies, build real-world projects, and gain the skills needed to land your first developer job or freelance clients."
 *                 imageUrl:
 *                   type: string
 *                   example: null
 *                 priceOriginal:
 *                   type: number
 *                   example: 99.99
 *                 priceDiscounted:
 *                   type: number
 *                   example: 79.99
 *                 status:
 *                   type: string
 *                   example: "DRAFT"
 *                 level:
 *                   type: string
 *                   example: "ALL_LEVELS"
 *                 duration:
 *                   type: string
 *                   example: "48 hours"
 *                 categoryId:
 *                   type: string
 *                   example: "3ac0ac14-3200-473b-9411-a485f7c23518"
 *                 instructorId:
 *                   type: string
 *                   example: "21fc9a45-aaa3-421f-a730-796d6b7be9b5"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-13T10:09:18.315Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-13T10:09:18.315Z"
 *                 category:
 *                   type: object
 *                   example:
 *                     id: "3ac0ac14-3200-473b-9411-a485f7c23518"
 *                     name: "Development"
 *                     description: "Programming and software development courses"
 *                     status: "ACTIVE"
 *                     createdAt: "2025-07-13T09:56:10.114Z"
 *                     updatedAt: "2025-07-13T09:56:10.114Z"
 *                 instructor:
 *                   type: object
 *                   example:
 *                     id: "21fc9a45-aaa3-421f-a730-796d6b7be9b5"
 *                     name: "John Smith"
 *                     email: "john.smith@edutech.com"
 *                     role: "INSTRUCTOR"
 *                     createdAt: "2025-07-13T09:01:04.188Z"
 *                     updatedAt: "2025-07-13T09:01:04.188Z"
 *                 modules:
 *                   type: array
 *                   example:
 *                     - id: "9455be47-dc58-4157-a620-629349ddb207"
 *                       courseId: "4afae000-b3db-4bfb-b9f2-7cc22cfbbc80"
 *                       title: "Introduction to Web Development"
 *                       duration: "3 hours"
 *                       order: 1
 *                       lessons:
 *                         - id: "cd4a351d-5a30-465e-aa4b-988a78b668d3"
 *                           moduleId: "9455be47-dc58-4157-a620-629349ddb207"
 *                           title: "Course Overview"
 *                           duration: "15 min"
 *                           order: 1
 *                 learningOutcomes:
 *                   type: array
 *                   example:
 *                     - id: "85b4560a-a36c-42a9-95ee-ab7ca53a2ae2"
 *                       courseId: "4afae000-b3db-4bfb-b9f2-7cc22cfbbc80"
 *                       text: "Build 16+ web development projects for your portfolio"
 *                 prerequisites:
 *                   type: array
 *                   example:
 *                     - id: "1ac95eea-2dcb-4c88-a955-d32b6714e246"
 *                       courseId: "4afae000-b3db-4bfb-b9f2-7cc22cfbbc80"
 *                       text: "Basic computer skills"
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