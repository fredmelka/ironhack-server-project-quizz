
import { Schema, model } from 'mongoose';

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// FRONTEND CONTROL : Passwords must be 8 characters long, contain one of each uppercase, lowercase, digit and special character.
// PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new Schema({
    _username: {
            type: String,
            required: [true, 'Username must be eight to twenty characters long.'],
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 8,
            maxLength: 20},
    _password: {
            type: String,
            required: true,
            select: false},
    _email: {
            type: String,
            required: [true, 'Valid email is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            match: EMAIL_REGEX},
    _role: {
            type: String,
            required: true,
            enum: ['Player', 'Master', 'Admin'],
            default: 'Player'},
    _friendlist: [String]       // Needs here some clarification and specification
    },
    {timestamps: true}
);

const User = model('User', userSchema);

export default User;