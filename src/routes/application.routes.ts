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
  downloadApplicationReceipt,
  createApplicationWithReceipt
} from '../controllers/application.controller';
import { upload } from '../utils/fileUpload';
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
  authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'INSTRUCTOR'),
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
router.get(
  '/:id', 
  authenticateJWT, 
  authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'INSTRUCTOR'),
  getApplicationById
);

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
  authenticateJWT,
  authorizeRoles('STUDENT'),
  validateRequest(applicationCreateSchema),
  createApplication
);

/**
 * @swagger
 * /api/applications/with-receipt:
 *   post:
 *     summary: Create a new application with receipt upload in a single request
 *     description: This endpoint allows students to submit their application along with a payment receipt in one atomic transaction. This solves the chicken-and-egg problem where receipt upload previously required an application ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - paymentMethod
 *               - paymentReference
 *               - fullName
 *               - dateOfBirth
 *               - gender
 *               - email
 *               - phone
 *               - address
 *               - receipt
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: Course ID to apply for
 *                 example: "b3b7c8e2-1d2f-4c3a-9e2b-123456789abc"
 *               paymentMethod:
 *                 type: string
 *                 enum: [TELEBIRR, CBE, AMOLE, OTHER]
 *                 description: Payment method used
 *                 example: "TELEBIRR"
 *               paymentReference:
 *                 type: string
 *                 minLength: 3
 *                 description: Transaction reference or ID
 *                 example: "TXN123456789"
 *               marketingSource:
 *                 type: string
 *                 description: How the user heard about the course
 *                 example: "social_media"
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 description: Student's full name
 *                 example: "John Doe"
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *                 description: Student's date of birth
 *                 example: "1990-01-01T00:00:00.000Z"
 *               gender:
 *                 type: string
 *                 description: Student's gender
 *                 example: "male"
 *               nationality:
 *                 type: string
 *                 description: Student's nationality
 *                 example: "Ethiopian"
 *               university:
 *                 type: string
 *                 description: Student's university
 *                 example: "Addis Ababa University"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: Student's phone number
 *                 example: "+251912345678"
 *               telegramHandle:
 *                 type: string
 *                 description: Student's Telegram handle
 *                 example: "@johndoe"
 *               address:
 *                 type: string
 *                 description: Student's address
 *                 example: "Addis Ababa, Ethiopia"
 *               paymentOption:
 *                 type: string
 *                 description: Payment option (full/installment)
 *                 example: "full"
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Payment receipt file (image or PDF)
 *     responses:
 *       201:
 *         description: Application created successfully with receipt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationWithReceiptResponse'
 *       400:
 *         description: Validation error or missing receipt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationError'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post(
  '/with-receipt',
  authenticateJWT,
  authorizeRoles('STUDENT'),
  upload.single('receipt'),
  validateRequest(applicationCreateSchema),
  createApplicationWithReceipt
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
  authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'INSTRUCTOR'),
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
  upload.single('receipt'),
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

