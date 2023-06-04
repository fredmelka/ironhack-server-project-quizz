
import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import questionsRoutes from './questions.routes.js';
import quizzRoutes from './quizz.routes.js';

const router = express.Router();

const healthCheck = (request, response, next) => {
    response.status(200).json({ success: true, message: 'HEALTH check: Connection to DB up and running.'});};


// ROUTES | PREFIXING + HEALTH CHECK
router.get('/', healthCheck);                   // Setting HEALTH check on the server
router.use('/auth', authRoutes);                // Prefixing AUTH routes
router.use('/user', userRoutes);                // Prefixing USER routes
router.use('/questions', questionsRoutes);      // Prefixing QUESTIONS routes
router.use('/quizz', quizzRoutes);              // Prefixing QUIZZ routes        

export default router;