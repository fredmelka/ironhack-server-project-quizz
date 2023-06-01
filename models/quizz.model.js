
import { Schema, model } from 'mongoose';
import User from './user.model.js'; 
import Question from './question.model.js';

const NON_EMPTY_STRING_REGEX = /^(?!\s*$).+/;
const capitalize = (string) => {if (typeof string != 'string') {string =''}; return string[0].toUpperCase() + string.substring(1)};

const quizzSchema = new Schema({
    _title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxLength: 50,
            set: capitalize},
    _tags: [        // Here it is an array of strings !!
            {type: String,
            match: NON_EMPTY_STRING_REGEX,
            uppercase: true}
            ],
    _difficulty: {
            type: String,
            required: true,
            enum: ['Rookie', 'Advanced', 'Expert']},
    _timer: {
            type: Number,
            required: true,
            default: 0},
    _questions: [
            {type: Schema.Types.ObjectId,
            ref: Question,
            required: true,
            select: false}
            ],
    _output: [Schema.Types.Mixed],      // Needs here some clarification and specification
    _icon:  {
            type: String},              // Needs here some clarification and specification
    _popularity: {
            type: Number,
            default: 0},
    _owner: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true}    
    },
    {timestamps: true}
);

const Quizz = model('Quizz', quizzSchema);

export default Quizz;