
import express from 'express';
import { isValidObjectId } from 'mongoose';
import Test from '../models/test.model.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();


// ROUTES | TEST
router.post('/start', authenticate, startTest);
router.patch('/record', authenticate, recordScore);


// FUNCTION | START A TEST
async function startTest (request, response, next) {

let {_id, _username} = request.user;
let {_quizz} = request.body;

// Rejection for Minimum Data Inconsistency
if (!_quizz) {response.status(400).json({success: false, message: 'Bad Request: Require a valid Quizz ID.'}); return;};

try {
    let startTest = await Test.create({_player: _id, _quizz: _quizz});
    response.status(201).json({success: true, message: `${_username} is starting Quizz ID ${_quizz}`, data: startTest});
}
catch (error) {console.log(error); next(error);};
};


// FUNCTION | POST SCORE AFTER COMPLETING THE TEST
async function recordScore (request, response, next) {

let {_username} = request.user;

// *** Destructuring of the QUERY Object of the Request Object ***
let {quizz: _id, score: _score} = request.query;

// Rejection for Minimum Data Inconsistency
if (!_id) {response.status(400).json({success: false, message: 'Bad Request: Missing Test ID, unable to record score.'}); return;};

// Rejection for inconsistency MongoBD Test _id passed in the body of the request 
if (!isValidObjectId(_id)) {
    response.status(400).json({success: false, message: 'Bad Request: Invalid Quizz ID provided in URL.'});
    return;};

try {
    let recordScoretoTest = await Test.findByIdAndUpdate(_id, {_score}, {new: true});
    response.status(201).json({success: true, message: `${_username} just recorded a score of ${_score}`, data: recordScoretoTest});
}
catch (error) {console.log(error); next(error);};
};

export default router;