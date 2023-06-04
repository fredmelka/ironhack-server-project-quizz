
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const tokenSecret = process.env.TOKEN_SECRET;


// MIDDLEWARE | AUTHENTICATE USER AND CONNECTION
async function authenticate (request, response, next) {

// Rejection for invalid request headers authorization content
if (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer')
    {response.status(400).json({success: false, message: 'Token not found.'}); return;};

try {
    let token = request.headers.authorization.split(' ')[1];
    let tokenDecoded = jwt.verify(token, tokenSecret, {algorithm: 'HS256'});

    let user = await User.findById(tokenDecoded._id);
    // Rejection for user not found
    if (!user) {response.status(401).json({success: false, message: 'Unauthorized: Invalid Token.'}); return;};

    // Attributes new key/value pairs to the request to be processed down further the route
    request.user = user;
    request.payload = tokenDecoded;
    // Moves to next middleware as everything went ok
    next();
}
catch (error) {console.log(error); next(error);};
};

export default authenticate;