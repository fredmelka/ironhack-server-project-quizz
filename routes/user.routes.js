
import express from 'express';
import { isValidObjectId } from 'mongoose';
import User from '../models/user.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();


// ROUTES | USER
router.get('/profile', authenticate, getOneProfile);


// FUNCTION | GET ONE USER PROFILE
async function getOneProfile (request, response, next) {

let {_id} = request.payload;
try {
    let userProfile = await User.findById({_id: _id});
    response.status(200).json({success: true, data: userProfile});
}
catch (error) {console.log(error); next(error);};
};

export default router;