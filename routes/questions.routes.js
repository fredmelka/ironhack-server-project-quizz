
import express from 'express';
import { isValidObjectId } from 'mongoose';
import Question from '../models/question.model.js';
import authenticate from '../middlewares/authenticate.js';
import controlRoleAdmin from '../middlewares/controlRoleAdmin.js';
import controlQuestionOwnership from '../middlewares/controlQuestionOwnership.js';

const router = express.Router();

// PARAMS | :_id | Controls of ObjectId consistency and Question existence 
router.param('_id', async (request, response, next, _id) => {

// Rejection for inconsistency MongoBD Question _id passed as parameter 
if (!isValidObjectId(_id)) {
    response.status(400).json({success: false, message: 'Bad Request: Invalid Question ID provided in URL.'});
    return;};

try {
    // Rejection for inexisting Question _id
    let isQuestionExisting = await Question.findById({_id: _id});
    if (!isQuestionExisting) {response.status(400).json({success: false, message: 'Question ID not found.'}); return;};
    
    // QuestionId is now added directly to the Request Object as a new key/value pair (vs in params sub-object)
    request.questionId = _id;
    next();
}
catch (error) {console.log(error); next(error);};
});


// ROUTES | QUESTIONS
router.get('/', authenticate, controlRoleAdmin, getFullBankOfQuestions);
router.post('/new', authenticate, addQuestion);
router.get('/:_id', authenticate, controlQuestionOwnership, getOneQuestion);


// FUNCTION | GET FULL BANK OF QUESTIONS
async function getFullBankOfQuestions (request, response, next) {
try {
    let questionsBank = await Question.find({}, {}).select('-_id -_answers._id -_answers.createdAt -_answers.updatedAt');
    // TO KEEP ALL FIELDS BUT: .select('-_id -_answers._id -_answers.createdAt -_answers.updatedAt')
    // TO PROJECT NORMALLY: find{query},{project})

    response.status(200).json({success: true, data: questionsBank});
}
catch (error) {console.log(error); next(error);};
};


// FUNCTION | CREATE A NEW QUESTION
async function addQuestion (request, response, next) {

let _owner = request.payload._id;
let {_tags, _level, _language, _label, _answers, _picture} = request.body;

// Rejection for Minimum Data Inconsistency
if (!_label || _answers.length === 0) {response.status(400).json({success: false, message: 'Bad Request: Insufficient data.'}); return;};

try {
    let newQuestion = await Question.create({_tags, _level, _language, _label, _answers, _picture, _owner});
    response.status(201).json({success: true, message: newQuestion._id});
}
catch (error) {console.log(error); next(error);};
};


// FUNCTION | GET ONE QUESTION DETAILS
async function getOneQuestion (request, response, next) {
try {
    let questionDetails = await Question.findById(request.questionId);
    response.status(200).json({success: true, data: questionDetails});
}
catch (error) {console.log(error); next(error);};
};

export default router;