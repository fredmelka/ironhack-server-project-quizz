
import express from 'express';                  // Importing module 'express' to set Router method
import authRoutes from './auth.routes.js';      // Importing the authentification routes

const router = express.Router();

const healthCheck = (request, response, next) => {
    response.status(200).json({ success: true, message: 'Database connection up and running.'});};

    
// ROUTES PREFIXING | PATHS FILES
router.get('/', healthCheck);                   // Setting a Health Check on the server
router.use('/auth', authRoutes);                // Setting the Authentification routes

export default router;