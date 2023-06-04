
import express from 'express';
import { isValidObjectId } from 'mongoose';
import Quizz from '../models/quizz.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();


// ROUTES | QUIZZ
router.get('/catalog', browseAllQuizz);
router.post('/new', authenticate, addQuizz);


// FUNCTION | BROWSE ALL QUIZZ SUMMARIES
async function browseAllQuizz (request, response, next) {
try {
    let quizzBank = await Quizz.find({}, {}).select('-_id -_timer -_output -_owner -createdAt -__v');
    response.status(200).json({success: true, data: quizzBank});
}
catch (error) {console.log(error); next(error);};
};

// FUNCTION | CREATE A NEW QUIZZ
async function addQuizz (request, response, next) {

let _owner = request.payload._id;
let {_title, _questions} = request.body;

// Rejection for Minimum Data Inconsistency
if (!_title || _questions.length === 0) {response.status(400).json({success: false, message: 'Bad Request: Insufficient data.'}); return;};

try {
    // Rejection for Double
    let isExisting = await Quizz.findOne({_title: _title});
    if (isExisting) {response.status(400).json({success: false, message: `Quizz named ${_title} already exists.`}); return;};

    let newQuizz = await Quizz.create({...request.body, _owner: _owner});
    response.status(201).json({success: true, quizz: newQuizz._id});
}
catch (error) {console.log(error); next(error);};
};

export default router;