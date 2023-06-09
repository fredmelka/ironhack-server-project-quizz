
import Question from '../models/question.model.js';


// MIDDLEWARE | CONTROL OWNERSHIP OF THE QUESTION TO ACCESS
async function controlQuestionOwnership (request, response, next) {

let {questionId, user} = request;
try {
    let questionDetails = await Question.findById(questionId);
    let {_owner: owner } = questionDetails;
        
    // The valueof() method of Mongoose allow to control ObjectId value using '==' operator
    if (user._id == owner.toString()) {return next();}
    else {response.status(401).json({success: false, message: 'Unauthorized: Not the Owner of the Question.'});};
}
catch (error) {console.log(error); next(error);};
};
    
export default controlQuestionOwnership;