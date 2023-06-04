
import Question from '../models/question.model.js';

async function controlOwner (request, response, next) {
    try {
        let questionDetails = await Question.findById(request.questionId);
        let {_owner: owner } = questionDetails; console.log(_owner);
        
        if (request.user._id.toString() === owner.toString()) {return next()}
        else {response.status(401).json({success: false, message: 'Unauthorized: Not the Owner of the Question.'});};
    }
    catch (error) {console.log(error); next(error);};
    };
    
    export default controlOwner;