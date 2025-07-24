import { Router } from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage,
  exportContactMessages
} from '../controllers/contactController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact Us (public messages) and admin message management
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact message (public)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: '+1234567890'
 *               message:
 *                 type: string
 *                 example: 'I am interested in your courses.'
 *     responses:
 *       201:
 *         description: Contact message created
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: List all contact messages (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied, all]
 *         required: false
 *         description: Filter by message status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by name, email, phone, or message
 *     responses:
 *       200:
 *         description: List of contact messages
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: Get a single contact message by ID (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact message ID
 *     responses:
 *       200:
 *         description: Contact message object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete a contact message (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact message ID
 *     responses:
 *       200:
 *         description: Contact message deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/contact/export/csv:
 *   get:
 *     summary: Export all contact messages as CSV (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file of contact messages
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

const router = Router();

// Public: Submit a contact message
router.post('/', createContactMessage);

// Admin: List all contact messages
router.get('/', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), getAllContactMessages);

// Admin: Get a single contact message by ID
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), getContactMessageById);

// Admin: Delete a contact message
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), deleteContactMessage);

// Admin: Export contact messages (CSV)
router.get('/export/csv', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), exportContactMessages);

export default router; 