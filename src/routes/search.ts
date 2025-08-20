import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { searchAll, searchApplications, searchStudents, searchCourses, quickSearch } from '../controllers/searchController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Admin dashboard search functionality
 */

/**
 * @swagger
 * /api/search/quick:
 *   get:
 *     summary: Quick search for admin dashboard header
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     description: Fast search across applications, students, and courses with limited results for dropdown display
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to look for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results per entity type
 *     responses:
 *       200:
 *         description: Quick search results for dropdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 query:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           status:
 *                             type: string
 *                           submittedAt:
 *                             type: string
 *                           course:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           _count:
 *                             type: object
 *                             properties:
 *                               StudentApplication:
 *                                 type: integer
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           shortDescription:
 *                             type: string
 *                           status:
 *                             type: string
 *                           category:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                           instructor:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                           _count:
 *                             type: object
 *                             properties:
 *                               StudentApplication:
 *                                 type: integer
 *                 summary:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: integer
 *                     students:
 *                       type: integer
 *                     courses:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 hasMore:
 *                   type: boolean
 *                   description: Indicates if there are more results available
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get('/quick', authenticateJWT, quickSearch);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search across all entities (applications, students, courses)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to look for
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, applications, students, courses]
 *           default: all
 *         description: Type of entities to search in
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results per entity type
 *     responses:
 *       200:
 *         description: Search results across all entities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 query:
 *                   type: string
 *                 type:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           status:
 *                             type: string
 *                           submittedAt:
 *                             type: string
 *                           course:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               category:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           StudentApplication:
 *                             type: array
 *                             items:
 *                               type: object
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           shortDescription:
 *                             type: string
 *                           status:
 *                             type: string
 *                           category:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                           instructor:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: integer
 *                     students:
 *                       type: integer
 *                     courses:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get('/', authenticateJWT, searchAll);

/**
 * @swagger
 * /api/search/applications:
 *   get:
 *     summary: Search student applications
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (name, email, phone, payment reference, etc.)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter by application status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated search results for applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentApplication'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
router.get('/applications', authenticateJWT, searchApplications);

/**
 * @swagger
 * /api/search/students:
 *   get:
 *     summary: Search students
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (name or email)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated search results for students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 students:
 *                   type: array
 *                   items:
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
 *                       createdAt:
 *                         type: string
 *                       studentProfile:
 *                         type: object
 *                       StudentApplication:
 *                         type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
router.get('/students', authenticateJWT, searchStudents);

/**
 * @swagger
 * /api/search/courses:
 *   get:
 *     summary: Search courses
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (title, description, category, instructor)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *         description: Filter by course status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated search results for courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
router.get('/courses', authenticateJWT, searchCourses);

export default router; 