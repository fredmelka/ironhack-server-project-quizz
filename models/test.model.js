
import { Schema, model } from 'mongoose';
import User from './user.model.js';
import Quizz from './quizz.model.js';

const testSchema = new Schema({
    _player: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true},
    _quizz: {
            type: Schema.Types.ObjectId,
            ref: Quizz,
            required: true},
    _score: {
            type: Number,
            required: true,
            default: 0}
    },
    {timestamps: {createdAt: 'startedAt', updatedAt: 'doneAt'}}
);

const Test = model('Test', testSchema);

export default Test;