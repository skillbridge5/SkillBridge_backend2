import { Router } from 'express';
import { listAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminUsers
 *   description: Manage admin users (ADMIN, SUPER_ADMIN, SUPPORT)
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: List and search admin users
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: List of admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUserResponse'
 *       500:
 *         description: Server error
 */
// List & search admin users
router.get('/', listAdmins);

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Create a new admin user
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUserCreateRequest'
 *     responses:
 *       201:
 *         description: Admin user created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUserCreatedResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
// Create new admin user
router.post('/', createAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Update an admin user
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUserUpdateRequest'
 *     responses:
 *       200:
 *         description: Admin user updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUserUpdatedResponse'
 *       400:
 *         description: Validation error or invalid role
 *       404:
 *         description: Admin user not found
 *       500:
 *         description: Server error
 */
// Update admin user
router.put('/:id', updateAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete an admin user
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Admin user deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin user deleted
 *       404:
 *         description: Admin user not found
 *       500:
 *         description: Server error
 */
// Delete admin user
router.delete('/:id', deleteAdmin);

export default router; 