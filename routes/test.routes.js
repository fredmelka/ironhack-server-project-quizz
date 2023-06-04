
import express from 'express';
import { isValidObjectId } from 'mongoose';
import Test from '../models/test.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();


// ROUTES | TEST
router.get('/', startTest);


// FUNCTION | START A TEST
async function startTest (request, response, next) {};


export default router;