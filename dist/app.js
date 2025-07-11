"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const category_1 = __importDefault(require("./routes/category"));
const course_1 = __importDefault(require("./routes/course"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/courses', course_1.default);
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = app;
