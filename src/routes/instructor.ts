import { Router } from 'express';
import {
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Manage course instructors and their profiles
 */

/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Get all instructors (with optional filters)
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by instructor status
 *       - in: query
 *         name: expertise
 *         schema:
 *           type: string
 *         description: Filter by expertise name (e.g. "Web Development")
 *     responses:
 *       200:
 *         description: List of instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InstructorResponse'
 */
router.get('/', authenticateJWT, getAllInstructors);

/**
 * @swagger
 * /api/instructors/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Instructor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstructorResponse'
 *       404:
 *         description: Instructor not found
 */
router.get('/:id', authenticateJWT, getInstructorById);

/**
 * @swagger
 * /api/instructors:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstructorCreateRequest'
 *     responses:
 *       201:
 *         description: Instructor created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstructorResponse'
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateJWT, createInstructor);

/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstructorUpdateRequest'
 *     responses:
 *       200:
 *         description: Instructor updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstructorResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Instructor not found
 */
router.put('/:id', authenticateJWT, updateInstructor);

/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Delete an instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Instructor deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Instructor deleted
 *       404:
 *         description: Instructor not found
 */
router.delete('/:id', authenticateJWT, deleteInstructor);

export default router; 