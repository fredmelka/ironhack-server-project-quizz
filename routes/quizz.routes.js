
import express from 'express';
import { isValidObjectId } from 'mongoose';
import Quizz from '../models/quizz.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// PARAMS | :_id | Controls of ObjectId consistency and Quizz existence
router.param('_id', async (request, response, next, _id) => {

// Rejection for inconsistency MongoBD Quizz _id passed as parameter 
if (!isValidObjectId(_id)) {
    response.status(400).json({success: false, message: 'Bad Request: Invalid Quizz ID provided in URL.'});
    return;};

try {
    // Rejection for inexisting Quizz _id
    let isQuizzExisting = await Quizz.findById({_id: _id});
    if (!isQuizzExisting) {response.status(400).json({success: false, message: 'Quizz ID not found.'}); return;};
    
    // QuizzId is now added directly to the Request Object as a new key/value pair (vs in params sub-object)
    request.quizzId = _id;
    next();
}
catch (error) {console.log(error); next(error);};
});


// ROUTES | QUIZZ
router.get('/catalog', browseAllQuizz);
router.post('/new', authenticate, addQuizz);
router.get('/:_id/run', authenticate, loadQuizzToRun);


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

// FUNCTION | LOAD QUIZZ TO RUN TEST
async function loadQuizzToRun (request, response, next) {
let {quizzId} = request;
try {
    let quizztoRun = await Quizz
                        .findById({_id: quizzId}, {})
                        .populate({path: '_questions', select: {_label: 1, _answers: {_text: 1, _value: 1}}});

    response.status(200).json({success: true, data: quizztoRun});
}
catch (error) {console.log(error); next(error);};
};

export default router;