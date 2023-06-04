
import express from 'express';
import Question from '../models/question.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// ROUTES | QUESTIONS
router.get('/', authenticate, getFullBankOfQuestions);
router.post('/new', authenticate, createNewQuestion);


// FUNCTION | GET FULL BANK OF QUESTIONS
async function getFullBankOfQuestions (request, response, next) {
try {
    let questionsBank = await Question.find({}, {});
    // TO KEEP ALL FIELDS BUT: .select('-_id -_answers._id -_answers.createdAt -_answers.updatedAt')
    // TO PROJECT NORMALLY: find{query},{project})

    response.status(200).json({success: true, data: questionsBank});
}
catch (error) {console.log(error); next(error);}
};

// FUNCTION | CREATE A NEW QUESTION
async function createNewQuestion (request, response, next) {

let _owner = request.payload._id;
let {_tags, _level, _label, _answers, _picture} = request.body;

// Rejection for Minimum Data Inconsistency
if (!_label || _answers.length === 0) {response.status(400).json({success: false, message: 'Bad Request: Insufficient data.'}); return;};

try {
    let newQuestion = await Question.create({_tags, _level, _label, _answers, _picture, _owner});
    response.status(201).json({success: true, question: newQuestion._id});
}
catch (error) {console.log(error); next(error);}
};

export default router;