
import mongoose from 'mongoose';
import data from './data.json' assert {type: 'json'};

import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import Quizz from '../models/quizz.model.js';
import Test from '../models/test.model.js';

const MONGODB_URI='mongodb://127.0.0.1:27017/skweez';

const test_User = data.user;
const test_question_1 = data.question_1;
const test_question_2 = data.question_2;
const test_question_3 = data.question_3;
const test_quizz = data.quizz;
const test = data.test;

mongoose
    .connect(MONGODB_URI)
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        return Test.deleteMany();
        })
    .then(async () =>{
        try {await Test.create(test);}
        catch (error) {console.log(error)};
    })
    .catch((error) => {console.log('Error while trying to connect to database');})
    .finally(() => {mongoose.disconnect(); console.log('Disconnected!')});