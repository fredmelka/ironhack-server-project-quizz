
// MIDDLEWARE | CONTROL WHETHER ROLE OF USER IS ADMIN OR NOT
async function controlRoleAdmin (request, response, next) {
try {
    if (request.user._role === 'Admin') {return next()}
    else {response.status(401).json({success: false, message: 'Unauthorized: Wrong Credentials.'});};
}
catch (error) {console.log(error); next(error);};
};

export default controlRoleAdmin;