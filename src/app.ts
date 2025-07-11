import express from 'express';
import cors from 'cors';
import pool from './config/database';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/course';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SkillBridge API',
    version: '1.0.0',
    description: 'API documentation for the SkillBridge e-learning backend',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Development server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
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