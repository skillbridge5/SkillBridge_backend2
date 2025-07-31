import { Router } from 'express';
import { 
  getPlatformSettings, 
  updatePlatformSettings, 
  resetPlatformSettings 
} from '../controllers/settingsController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PlatformSettings
 *   description: Manage platform settings and configuration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlatformSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "settings-12345678-1234-1234-1234-123456789abc"
 *         siteName:
 *           type: string
 *           example: "SkillBridge"
 *         contactEmail:
 *           type: string
 *           format: email
 *           example: "contact@skillbridge.com"
 *         siteDescription:
 *           type: string
 *           example: "Bridging Gaps, Building Skills, Transforming Futures"
 *         contactPhone:
 *           type: string
 *           example: "+251 2345 4365"
 *         address:
 *           type: string
 *           example: "123 Education Street, Learning City"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PlatformSettingsUpdateRequest:
 *       type: object
 *       required:
 *         - siteName
 *         - contactEmail
 *         - siteDescription
 *         - contactPhone
 *         - address
 *       properties:
 *         siteName:
 *           type: string
 *           example: "SkillBridge"
 *         contactEmail:
 *           type: string
 *           format: email
 *           example: "contact@skillbridge.com"
 *         siteDescription:
 *           type: string
 *           example: "Bridging Gaps, Building Skills, Transforming Futures"
 *         contactPhone:
 *           type: string
 *           example: "+251 2345 4365"
 *         address:
 *           type: string
 *           example: "123 Education Street, Learning City"
 *     PlatformSettingsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/PlatformSettings'
 *     PlatformSettingsUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Platform settings updated successfully"
 *         data:
 *           $ref: '#/components/schemas/PlatformSettings'
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get platform settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlatformSettingsResponse'
 *       500:
 *         description: Server error
 */
router.get('/', getPlatformSettings);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update platform settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlatformSettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: Platform settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlatformSettingsUpdateResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/', updatePlatformSettings);

/**
 * @swagger
 * /api/settings/reset:
 *   post:
 *     summary: Reset platform settings to defaults
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform settings reset to defaults successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Platform settings reset to defaults successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PlatformSettings'
 *       500:
 *         description: Server error
 */
router.post('/reset', resetPlatformSettings);

export default router; 