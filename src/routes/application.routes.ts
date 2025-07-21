// COMMENTED OUT: This route is not built yet and references missing controller exports.
/*
/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application management endpoints
 */

import express from 'express';
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  getUserApplications,
  uploadApplicationReceipt,
  downloadApplicationReceipt
} from '../controllers/application.controller';
import { uploadReceipt } from '../utils/fileUpload';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';
import { validateRequest } from '../middlewares/validateRequest';
import { applicationCreateSchema, applicationUpdateSchema } from '../middlewares/validators/applicationValidation';

const router = express.Router();

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all student applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter by application status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student name, email, or payment reference
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR'),
  getAllApplications
);

/**
 * @swagger
 * /api/applications/me:
 *   get:
 *     summary: Get current user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the student's applications
 */
router.get(
  '/me',
  authenticateJWT,
  authorizeRoles('STUDENT'),
  getUserApplications
);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get a specific application by ID
 *     tags: [Applications]
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
 *         description: Application details
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Application not found
 */
router.get('/:id', authenticateJWT, getApplicationById);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationCreateInput'
 *     responses:
 *       201:
 *         description: Application created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Course not found
 */
router.post(
  '/',
  validateRequest(applicationCreateSchema),
  createApplication
);

/**
 * @swagger
 * /api/applications/{id}:
 *   patch:
 *     summary: Update application status or data
 *     tags: [Applications]
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
 *             $ref: '#/components/schemas/ApplicationUpdateInput'
 *     responses:
 *       200:
 *         description: Application updated
 *       400:
 *         description: Validation error
 */
router.patch(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR'),
  validateRequest(applicationUpdateSchema),
  updateApplication
);

/**
 * @swagger
 * /api/applications/{id}/receipt:
 *   post:
 *     summary: Upload a payment receipt for an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receipt uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
  '/:id/receipt',
  authenticateJWT,
  authorizeRoles('STUDENT'),
  uploadReceipt,
  uploadApplicationReceipt
);

/**
 * @swagger
 * /api/applications/{id}/receipt:
 *   get:
 *     summary: Download a payment receipt
 *     tags: [Applications]
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
 *         description: Receipt file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Receipt not found
 */
router.get(
  '/:id/receipt',
  authenticateJWT,
  downloadApplicationReceipt
);

export default router;

