
import express from 'express';
import authRoutes from './auth.routes.js';
import questionsRoutes from './questions.routes.js';

const router = express.Router();

const healthCheck = (request, response, next) => {
    response.status(200).json({ success: true, message: 'Database connection up and running.'});};

    
// ROUTES | PREFIXING + HEALTH CHECK
router.get('/', healthCheck);                           // Setting Health Check on the server
router.use('/auth', authRoutes);                        // Setting Authentification routes
router.use('/questions', questionsRoutes);              // Setting Questions routes

export default router;