import express from 'express';
import cors from 'cors';
import pool from './config/database';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/course';
import instructorRoutes from './routes/instructor';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructors', instructorRoutes);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SkillBridge API',
    version: '1.0.0',
    description: 'API documentation for the SkillBridge e-learning backend',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Development server' },
    { url: 'https://skillbridge-backend-w2s4.onrender.com', description: 'Production server (Render)' },
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
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
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
    },
  },
  security: [
    { bearerAuth: [] }
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


export default app; 