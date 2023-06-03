
import 'dotenv/config.js';                              // Importing module 'dotenv' to get access to environment variables and settings
import mongoose from 'mongoose';                        // Importing module 'mongoose' to handle exchanges with the database
import data from './data.json' assert {type: 'json'};   // JSON file for seeding data

import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import Quizz from '../models/quizz.model.js';
import Test from '../models/test.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skweez';

const user = data.user;
const question_1 = data.question_1;
const question_2 = data.question_2;
const question_3 = data.question_3;
const quizz = data.quizz;
const test = data.test;

mongoose
    .connect(MONGODB_URI)
    .then(async (x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        return await User.deleteMany();
        })
    .then(async () => {
        try {await User.create(user);}
        catch (error) {console.log(error)};
    })
    .catch((error) => {console.log('Error while trying to connect to database');})
    .finally(() => {mongoose.disconnect(); console.log('Disconnected!')});