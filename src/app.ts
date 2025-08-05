import express from 'express';
import cors from 'cors';
import pool from './config/database';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/course';
import instructorRoutes from './routes/instructor';
import adminRoutes from './routes/admin';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';
import notificationRoutes from './routes/notifications';
import searchRoutes from './routes/search';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import applicationRoutes from './routes/application.routes';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { errorHandler } from './middlewares/errorHandler';
import { getLandingCoursesPublic } from './controllers/courseController';
import contactRoutes from './routes/contact';

const app = express();

app.use(cors());
app.use(express.json());

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

const uploadsDir = path.join(__dirname, 'uploads/receipts');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

app.use('/api/instructors', instructorRoutes);
app.use('/api/admins', adminRoutes);

// Register the new public landing courses endpoint directly
app.get('/api/landing/courses', getLandingCoursesPublic);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SkillBridge API',
    version: '1.0.0',
    description: 'API documentation for the SkillBridge e-learning backend',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Development server' },
    { url: 'https://skillbridge-backend2.onrender.com', description: 'Production server (Render)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      InstructorResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          phone: { type: 'string', nullable: true },
          yearsOfExperience: { type: 'integer', nullable: true },
          bio: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          rating: { type: 'number', nullable: true },
          students: { type: 'integer', nullable: true },
          expertise: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of expertise names',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      },
      InstructorCreateRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'John Smith' },
          email: { type: 'string', example: 'john.smith@edutech.com' },
          phone: { type: 'string', example: '+1234567890' },
          yearsOfExperience: { type: 'integer', example: 8 },
          bio: { type: 'string', example: 'Experienced full-stack developer...' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
          rating: { type: 'number', example: 4.8 },
          students: { type: 'integer', example: 1245 },
          expertise: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of expertise names',
            example: ['Web Development', 'JavaScript', 'React'],
          },
        },
      },
      InstructorUpdateRequest: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          yearsOfExperience: { type: 'integer' },
          bio: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          rating: { type: 'number' },
          students: { type: 'integer' },
          expertise: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of expertise names',
          },
        },
      },
      AdminUserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'] },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          lastLogin: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          adminProfile: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              adminLevel: { type: 'integer', nullable: true },
            },
          },
        },
      },
      AdminUserCreateRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'Jane Admin' },
          email: { type: 'string', example: 'jane.admin@edutech.com' },
          password: { type: 'string', example: 'securePassword123' },
          role: { type: 'string', enum: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'], example: 'ADMIN' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
        },
      },
      AdminUserUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Admin' },
          email: { type: 'string', example: 'jane.admin@edutech.com' },
          password: { type: 'string', example: 'securePassword123' },
          role: { type: 'string', enum: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'], example: 'ADMIN' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
        },
      },
      ApplicationCreateInput: {
        type: 'object',
        required: [
          'courseId',
          'paymentMethod',
          'paymentReference',
          'fullName',
          'dateOfBirth',
          'gender',
          'email',
          'phone',
          'address'
        ],
        properties: {
          courseId: { type: 'string', format: 'uuid', example: 'b3b7c8e2-1d2f-4c3a-9e2b-123456789abc' },
          paymentMethod: { type: 'string', example: 'bank_transfer' },
          paymentReference: { type: 'string', example: 'TRX123456' },
          marketingSource: { type: 'string', example: 'Instagram', nullable: true },
          fullName: { type: 'string', example: 'Alice Johnson' },
          dateOfBirth: { type: 'string', format: 'date-time', example: '2000-01-15T00:00:00.000Z' },
          gender: { type: 'string', example: 'Female' },
          university: { type: 'string', example: 'Harvard University', nullable: true },
          email: { type: 'string', format: 'email', example: 'alice.johnson@example.com' },
          phone: { type: 'string', example: '+1234567890' },
          telegramHandle: { type: 'string', example: '@alicejohnson', nullable: true },
          address: { type: 'string', example: '123 Main St, Springfield' },
          paymentOption: { type: 'string', example: 'installment', nullable: true },
        },
        example: {
          courseId: 'b3b7c8e2-1d2f-4c3a-9e2b-123456789abc',
          paymentMethod: 'bank_transfer',
          paymentReference: 'TRX123456',
          marketingSource: 'Instagram',
          fullName: 'Alice Johnson',
          dateOfBirth: '2000-01-15T00:00:00.000Z',
          gender: 'Female',
          university: 'Harvard University',
          email: 'alice.johnson@example.com',
          phone: '+1234567890',
          telegramHandle: '@alicejohnson',
          address: '123 Main St, Springfield',
          paymentOption: 'installment'
        }
      },
      StudentApplication: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'app-12345678-1234-1234-1234-123456789abc' },
          studentId: { type: 'string', example: 'user-12345678-1234-1234-1234-123456789abc' },
          courseId: { type: 'string', example: 'course-12345678-1234-1234-1234-123456789abc' },
          paymentMethod: { type: 'string', example: 'TELEBIRR' },
          paymentReference: { type: 'string', example: 'TXN123456789' },
          status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
          submittedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          reviewedAt: { type: 'string', format: 'date-time', nullable: true },
          reviewedBy: { type: 'string', nullable: true },
          adminNotes: { type: 'string', nullable: true },
          marketingSource: { type: 'string', example: 'social_media', nullable: true },
          fullName: { type: 'string', example: 'John Doe' },
          dateOfBirth: { type: 'string', format: 'date-time', example: '1990-01-01T00:00:00.000Z' },
          gender: { type: 'string', example: 'male' },
          nationality: { type: 'string', example: 'Ethiopian', nullable: true },
          university: { type: 'string', example: 'Addis Ababa University', nullable: true },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '+251912345678' },
          telegramHandle: { type: 'string', example: '@johndoe', nullable: true },
          address: { type: 'string', example: 'Addis Ababa, Ethiopia', nullable: true },
          receiptUrl: { type: 'string', example: 'https://example.com/receipt.jpg', nullable: true },
          receiptVerified: { type: 'boolean', example: false },
          paymentOption: { type: 'string', example: 'full', nullable: true },
          course: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Machine Learning with Python' }
            }
          },
          student: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'John Doe' }
            }
          }
        }
      },
      ApplicationWithReceiptResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Application submitted successfully with receipt' },
          application: { $ref: '#/components/schemas/StudentApplication' }
        }
      },
      ApplicationError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Receipt file is required' },
          details: { type: 'string', example: 'Failed to create application with receipt' }
        }
      },
      AdminUserCreatedResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Admin user created' },
          user: { $ref: '#/components/schemas/AdminUserResponse' },
        },
      },
      AdminUserUpdatedResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Admin user updated' },
          user: { $ref: '#/components/schemas/AdminUserResponse' },
        },
      },
      PlatformSettings: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'settings-12345678-1234-1234-1234-123456789abc' },
          siteName: { type: 'string', example: 'SkillBridge' },
          contactEmail: { type: 'string', format: 'email', example: 'contact@skillbridge.com' },
          siteDescription: { type: 'string', example: 'Bridging Gaps, Building Skills, Transforming Futures' },
          contactPhone: { type: 'string', example: '+251 2345 4365' },
          address: { type: 'string', example: '123 Education Street, Learning City' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PlatformSettingsUpdateRequest: {
        type: 'object',
        required: ['siteName', 'contactEmail', 'siteDescription', 'contactPhone', 'address'],
        properties: {
          siteName: { type: 'string', example: 'SkillBridge' },
          contactEmail: { type: 'string', format: 'email', example: 'contact@skillbridge.com' },
          siteDescription: { type: 'string', example: 'Bridging Gaps, Building Skills, Transforming Futures' },
          contactPhone: { type: 'string', example: '+251 2345 4365' },
          address: { type: 'string', example: '123 Education Street, Learning City' },
        },
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'course-12345678-1234-1234-1234-123456789abc' },
          title: { type: 'string', example: 'Complete Web Development Bootcamp' },
          shortDescription: { type: 'string', example: 'Learn HTML, CSS, JavaScript, React, Node.js and more' },
          detailedDescription: { type: 'string', example: 'A comprehensive course covering all aspects of web development' },
          imageUrl: { type: 'string', example: 'https://example.com/course-image.jpg', nullable: true },
          priceOriginal: { type: 'number', example: 99.99 },
          priceDiscounted: { type: 'number', example: 79.99 },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'], example: 'PUBLISHED' },
          level: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'], example: 'BEGINNER' },
          duration: { type: 'string', example: '12 weeks' },
          categoryId: { type: 'string', example: 'category-12345678-1234-1234-1234-123456789abc' },
          instructorId: { type: 'string', example: 'instructor-12345678-1234-1234-1234-123456789abc' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          category: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'category-12345678-1234-1234-1234-123456789abc' },
              name: { type: 'string', example: 'Software Engineering' },
              description: { type: 'string', example: 'Software development and programming courses' },
              status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' }
            }
          },
          instructor: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'instructor-12345678-1234-1234-1234-123456789abc' },
              name: { type: 'string', example: 'John Smith' },
              email: { type: 'string', format: 'email', example: 'john.smith@edutech.com' },
              role: { type: 'string', example: 'INSTRUCTOR' }
            }
          },
          modules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'module-12345678-1234-1234-1234-123456789abc' },
                title: { type: 'string', example: 'Introduction to HTML' },
                duration: { type: 'string', example: '2 hours' },
                order: { type: 'integer', example: 1 },
                lessons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'lesson-12345678-1234-1234-1234-123456789abc' },
                      title: { type: 'string', example: 'HTML Basics' },
                      duration: { type: 'string', example: '30 minutes' },
                      order: { type: 'integer', example: 1 }
                    }
                  }
                }
              }
            }
          },
          learningOutcomes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'outcome-12345678-1234-1234-1234-123456789abc' },
                text: { type: 'string', example: 'Build responsive websites using HTML, CSS, and JavaScript' }
              }
            }
          },
          prerequisites: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'prerequisite-12345678-1234-1234-1234-123456789abc' },
                text: { type: 'string', example: 'Basic computer literacy' }
              }
            }
          }
        }
      },
    },
  },
  security: [
    { bearerAuth: [] }
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [process.env.NODE_ENV === 'production' ? './dist/routes/*.js' : './src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;