
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authenticate from '../middlewares/authenticate.js';
import User from '../models/user.model.js';

const saltRounds = Number(process.env.SALT);
const tokenSecret = process.env.TOKEN_SECRET;

const router = express.Router();


// ROUTES | AUTHENTIFICATION
router.post('/signup', signUp);
router.post('/login', login);
router.get('/verify', authenticate, getCredentials);

// FUNCTION | SIGNUP
async function signUp (request, response, next) {

let {_username, _password, _email} = request.body;

// Rejection for empty inputs
if (_username == '' || _password == '' || _email == '') {
    response.status(400).json({success: false, message: 'Please provide non empty inputs.'});
    return;};

// Rejection for invalid email format
let EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
if (!EMAIL_REGEX.test(_email)) {
    response.status(400).json({success: false, message: 'Please provide a valid email.'});
    return;};

// Rejection for invalid password format (Rules: 8 chars min at least one A-a-9-@)
let PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!PASSWORD_REGEX.test(_password)) {
    response.status(400).json({success: false, message: 'Password must have 8 characters minimum of which at least one uppercase, lowercase, digit and special.'});
    return;};

// Rejection for invalid _username length
if (_username.length < 8 || _username.length > 20) {
    response.status(400).json({success: false, message: 'Username must be 8 to 20 characters long.'});
    return;};

try {
    let foundUser = await User.findOne({_email: _email});
    
    // Rejection for _email already in use
    if (foundUser) {response.status(400).json({success: false, message: 'User with such email already exists.'}); return;};

    // Email is as of now supposedly new and server can proceed to sign up
    let generatedSalt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(_password, generatedSalt);

    // Creation of the new User in the database
    let createdUser = await User.create({_username, _password: hashedPassword, _email});

    // Destructuring of the new User object to hide hashed password
    let {_username: username, _email: email , _role: role, _id: id} = createdUser;
    let newUser = {username, email, role, id};
    
    // Send success response
    response.status(201).json({success: true, user: newUser});
}
catch (error) {console.log(error); next(error);};
};


// FUNCTION | LOGIN
async function login (request, response, next) {

let { _email, _password } = request.body;

// Rejection for empty inputs
if (_email == '' || _password == '') {
    response.status(400).json({success: false, message: 'Bad Request: Please provide non empty inputs.'});
    return;};

try {
    let user = await User.findOne({_email: _email}).select('_username _password');

    // Rejection for user not found
    if (!user) {response.status(401).json({success: false, message: 'Unauthorized: Wrong Credentials.'}); return;};

    // Performs comparison between input password and stored hashed password
    let isPasswordValid = await bcrypt.compare(_password, user._password);

    // Rejection for invalid password
    if (!isPasswordValid) {response.status(401).json({success: false, message: 'Unauthorized: Wrong Credentials.'}); return;};

    // Performs Token construction to be sent as response
    let payload = {_username: user._username, _id: user._id};
    let authToken = jwt.sign(payload, tokenSecret, {algorithm: 'HS256', expiresIn: '1h'}); 
    response.status(200).json({success: true, message: authToken});
}
catch (error) {console.log(error); next(error);};
};


// FUNCTION | VERIFY
async function getCredentials (request, response, next) {
try {
    console.log(`Payload _id sent with the request is ${request.payload._id}`);
    response.status(200).json({success: true, payload: request.payload, user: request.user});
}
catch (error) {console.log(error); next(error);};
};

export default router;