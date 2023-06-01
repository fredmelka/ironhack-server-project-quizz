
import express from 'express';              // Importing module 'express' to set Router method
import bcrypt from 'bcryptjs';              // Importing module 'bcryptjs' to deal with password encryption
import jwt from 'jsonwebtoken';             // Importing module 'jsonwebtoken' to manage token exchanges and authentication
// import { isAuthenticated } from... 
import User from '../models/user.model.js'; // Importing model User to interact with database

const saltRounds = process.env.SALT;
const router = express.Router();

// Setting the Authentification routes
router.post('/signup', signUp);

async function signUp (request, response, next) {
    
const {_username, _password, _email } = request.body;

    // Rejection for empty inputs
    if (_username == '' || _password == '' || _email == '') {
        response.status(400).json({success: false, message: 'Bad Request: Please provide non empty inputs.'});
        return;};

    // Rejection for invalid email format
    let EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!EMAIL_REGEX.test(_email)) {
        response.status(400).json({success: false, message: 'Bad Request: Please provide a valid email.'});
        return;
    };

    // Rejection for invalid password format (Require 8 characters minimum inclding 1 of each: Uppercase, Lowercase, Digit and Special)
    let PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!PASSWORD_REGEX.test(_password)) {
        response.status(400).json({success: false, message: 'Bad Request: Password must be 8 characters minimum and contain at least one of each uppercase, lowercase, digit and special characters.'});
        return;
    };

    // Rejection for invalid username length
    if (_username.length < 8 || _username.length > 20) {
        response.status(400).json({success: false, message: 'Bad Request: Username must be 8 to 20 characters long.'});
        return;
    };

try {
    let foundUser = await User.findOne({_email: _email});
    
    // Rejection for _email already is already existing in database
    if (foundUser) {response.status(400).json({success: false, message: 'Bad Request: User with such email already exists.'}); return;};

    // Email is as of now supposedly new and server can proceed to sign up
    const generatedSalt = await bcrypt.genSalt(15);
    let hashedPassword = await bcrypt.hash(_password, generatedSalt);

    // Creation of the new User in the database
    let createdUser = await User.create({_username, _password: hashedPassword, _email});

    // Destructuration of the new User object to omit hashed password
    
    // let {username: _username, mail: _email, id: _id, status: _status} = createdUser;
    let newUser = {username: createdUser._username, mail: createdUser._email};
    
    // Send success response
    response.status(201).json({success: true, user: newUser});
}
catch (error) {console.log(error); next(error);};
};

export default router;