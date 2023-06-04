
import { Schema, model } from 'mongoose';
import User from './user.model.js'; 

const NON_EMPTY_STRING_REGEX = /^(?!\s*$).+/;
const PICTURE_URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
const capitalize = (string) => {if (typeof string != 'string') {string =''}; return string[0].toUpperCase() + string.substring(1)};

// Creating Schema for the Subdocument 'answer' 
const answerSchema = new Schema({
    _text: {type: String, required: true, trim: true},
    _value: {type: Number, required: true, default: 0}
    },
    {_id: false, timestamps: true}
);

const questionSchema = new Schema({
    _tags: [        // Here it is an array of strings !!
            {type: String,
            match: NON_EMPTY_STRING_REGEX,
            uppercase: true}
            ],
    _level: {
            type: String,
            required: true,
            enum: ['Easy', 'Intermediate', 'Hard']},
    _language: {
            type: String,
            required: true,
            default: 'French',
            enum: ['French', 'English', 'Chinese']},
    _label: {
            type: String,
            required: true,
            trim: true,
            set: capitalize},
    _answers: [     // Here it is an array of subdocuments !!
            {type: answerSchema, 
            default: {}, // OR Try this syntax to match Mongoose's documentation about passing default as turnaround: 'default: () => ({})'
            select: false}
            ],
    _picture: {
            type: String,
            match: PICTURE_URL_REGEX},
    _owner: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true}
    },
    {timestamps: true}
);

const Question = model('Question', questionSchema);

export default Question;