import { Router } from 'express';
import { 
  getPlatformSettings, 
  updatePlatformSettings, 
  resetPlatformSettings,
  getEmailSettings,
  updateEmailSettings,
  getSecuritySettings,
  updateSecuritySettings,
  getSocialSettings,
  updateSocialSettings,
  getAdvancedSettings,
  updateAdvancedSettings
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
 *     EmailSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "email-settings-12345678-1234-1234-1234-123456789abc"
 *         smtpHost:
 *           type: string
 *           example: "smtp.gmail.com"
 *         smtpPort:
 *           type: integer
 *           example: 587
 *         smtpUsername:
 *           type: string
 *           format: email
 *           example: "admin@edutech.com"
 *         smtpPassword:
 *           type: string
 *           example: "********"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EmailSettingsUpdateRequest:
 *       type: object
 *       required:
 *         - smtpHost
 *         - smtpPort
 *         - smtpUsername
 *         - smtpPassword
 *       properties:
 *         smtpHost:
 *           type: string
 *           example: "smtp.gmail.com"
 *         smtpPort:
 *           type: integer
 *           example: 587
 *         smtpUsername:
 *           type: string
 *           format: email
 *           example: "admin@edutech.com"
 *         smtpPassword:
 *           type: string
 *           example: "your-smtp-password"
 *     SecuritySettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "security-settings-12345678-1234-1234-1234-123456789abc"
 *         allowUserRegistration:
 *           type: boolean
 *           example: true
 *         requireEmailVerification:
 *           type: boolean
 *           example: true
 *         enableNotifications:
 *           type: boolean
 *           example: true
 *         maintenanceMode:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SecuritySettingsUpdateRequest:
 *       type: object
 *       required:
 *         - allowUserRegistration
 *         - requireEmailVerification
 *         - enableNotifications
 *         - maintenanceMode
 *       properties:
 *         allowUserRegistration:
 *           type: boolean
 *           example: true
 *         requireEmailVerification:
 *           type: boolean
 *           example: true
 *         enableNotifications:
 *           type: boolean
 *           example: true
 *         maintenanceMode:
 *           type: boolean
 *           example: false
 *     SocialSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "social-settings-12345678-1234-1234-1234-123456789abc"
 *         facebookUrl:
 *           type: string
 *           nullable: true
 *           example: "https://facebook.com/yourpage"
 *         twitterUrl:
 *           type: string
 *           nullable: true
 *           example: "https://twitter.com/yourhandle"
 *         linkedinUrl:
 *           type: string
 *           nullable: true
 *           example: "https://linkedin.com/company/yourcompany"
 *         instagramUrl:
 *           type: string
 *           nullable: true
 *           example: "https://instagram.com/yourhandle"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SocialSettingsUpdateRequest:
 *       type: object
 *       properties:
 *         facebookUrl:
 *           type: string
 *           nullable: true
 *           example: "https://facebook.com/yourpage"
 *         twitterUrl:
 *           type: string
 *           nullable: true
 *           example: "https://twitter.com/yourhandle"
 *         linkedinUrl:
 *           type: string
 *           nullable: true
 *           example: "https://linkedin.com/company/yourcompany"
 *         instagramUrl:
 *           type: string
 *           nullable: true
 *           example: "https://instagram.com/yourhandle"
 *     AdvancedSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "advanced-settings-12345678-1234-1234-1234-123456789abc"
 *         debugMode:
 *           type: boolean
 *           example: false
 *         logLevel:
 *           type: string
 *           enum: [error, warn, info, debug]
 *           example: "info"
 *         cacheEnabled:
 *           type: boolean
 *           example: true
 *         maxUploadSize:
 *           type: integer
 *           example: 5242880
 *         sessionTimeout:
 *           type: integer
 *           example: 3600
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AdvancedSettingsUpdateRequest:
 *       type: object
 *       required:
 *         - debugMode
 *         - logLevel
 *         - cacheEnabled
 *         - maxUploadSize
 *         - sessionTimeout
 *       properties:
 *         debugMode:
 *           type: boolean
 *           example: false
 *         logLevel:
 *           type: string
 *           enum: [error, warn, info, debug]
 *           example: "info"
 *         cacheEnabled:
 *           type: boolean
 *           example: true
 *         maxUploadSize:
 *           type: integer
 *           example: 5242880
 *         sessionTimeout:
 *           type: integer
 *           example: 3600
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

// Email Settings Routes
/**
 * @swagger
 * /api/settings/email:
 *   get:
 *     summary: Get email settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EmailSettings'
 *       500:
 *         description: Server error
 */
router.get('/email', getEmailSettings);

/**
 * @swagger
 * /api/settings/email:
 *   put:
 *     summary: Update email settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailSettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: Email settings updated successfully
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
 *                   example: "Email settings updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/EmailSettings'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/email', updateEmailSettings);

// Security Settings Routes
/**
 * @swagger
 * /api/settings/security:
 *   get:
 *     summary: Get security settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Security settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SecuritySettings'
 *       500:
 *         description: Server error
 */
router.get('/security', getSecuritySettings);

/**
 * @swagger
 * /api/settings/security:
 *   put:
 *     summary: Update security settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SecuritySettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: Security settings updated successfully
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
 *                   example: "Security settings updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SecuritySettings'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/security', updateSecuritySettings);

// Social Settings Routes
/**
 * @swagger
 * /api/settings/social:
 *   get:
 *     summary: Get social media settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Social settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SocialSettings'
 *       500:
 *         description: Server error
 */
router.get('/social', getSocialSettings);

/**
 * @swagger
 * /api/settings/social:
 *   put:
 *     summary: Update social media settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialSettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: Social settings updated successfully
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
 *                   example: "Social settings updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/SocialSettings'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/social', updateSocialSettings);

// Advanced Settings Routes
/**
 * @swagger
 * /api/settings/advanced:
 *   get:
 *     summary: Get advanced settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Advanced settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AdvancedSettings'
 *       500:
 *         description: Server error
 */
router.get('/advanced', getAdvancedSettings);

/**
 * @swagger
 * /api/settings/advanced:
 *   put:
 *     summary: Update advanced settings
 *     tags: [PlatformSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvancedSettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: Advanced settings updated successfully
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
 *                   example: "Advanced settings updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/AdvancedSettings'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/advanced', updateAdvancedSettings);

export default router; 