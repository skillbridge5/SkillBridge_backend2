import { Router } from 'express';
import { 
  getDashboardStats, 
  getDashboardCharts 
} from '../controllers/dashboardController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and analytics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardMetric:
 *       type: object
 *       properties:
 *         value:
 *           type: integer
 *           example: 1250
 *         growth:
 *           type: integer
 *           example: 12
 *         growthText:
 *           type: string
 *           example: "+12% from last month"
 *     DashboardStatusMetric:
 *       type: object
 *       properties:
 *         value:
 *           type: integer
 *           example: 12
 *         label:
 *           type: string
 *           example: "Awaiting review"
 *     RecentApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "app-12345678-1234-1234-1234-123456789abc"
 *         studentName:
 *           type: string
 *           example: "Ahmed Hassan Mohammed"
 *         courseTitle:
 *           type: string
 *           example: "Web Development Bootcamp"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: "PENDING"
 *         submittedAt:
 *           type: string
 *           format: date-time
 *     PopularCourse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "course-12345678-1234-1234-1234-123456789abc"
 *         title:
 *           type: string
 *           example: "Complete Web Development Bootcamp"
 *         category:
 *           type: string
 *           example: "Development"
 *         students:
 *           type: integer
 *           example: 15000
 *         rating:
 *           type: number
 *           example: 4.8
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalStudents:
 *           $ref: '#/components/schemas/DashboardMetric'
 *         activeCourses:
 *           $ref: '#/components/schemas/DashboardMetric'
 *         applications:
 *           $ref: '#/components/schemas/DashboardMetric'
 *         revenue:
 *           $ref: '#/components/schemas/DashboardMetric'
 *         pendingApplications:
 *           $ref: '#/components/schemas/DashboardStatusMetric'
 *         newStudents:
 *           $ref: '#/components/schemas/DashboardStatusMetric'
 *         completionRate:
 *           $ref: '#/components/schemas/DashboardStatusMetric'
 *         totalCourses:
 *           $ref: '#/components/schemas/DashboardStatusMetric'
 *         recentApplications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecentApplication'
 *         popularCourses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PopularCourse'
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/DashboardStats'
 *     ChartDataPoint:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "Jan 2024"
 *         students:
 *           type: integer
 *           example: 45
 *         courses:
 *           type: integer
 *           example: 12
 *         applications:
 *           type: integer
 *           example: 89
 *     ChartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChartDataPoint'
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       500:
 *         description: Server error
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /api/dashboard/charts:
 *   get:
 *     summary: Get dashboard chart data (last 6 months)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartResponse'
 *       500:
 *         description: Server error
 */
router.get('/charts', getDashboardCharts);

export default router; 