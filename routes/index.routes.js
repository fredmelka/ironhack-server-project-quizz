
// Importing module 'express' to set Router method
import express from 'express';
const router = express.Router();

const healthCheck = (request, response, next) => {
    response.status(200).json({ success: true, message: 'Database connection up and running.'});
};

// Setting a Health Check on the server
router.get('/', healthCheck);

export default router;