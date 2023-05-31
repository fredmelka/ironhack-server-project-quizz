
export default function (app) {
    app.use((request, response, next) => {response.status(404).json({success: false, message: 'Resource not found.'})});
    app.use((error, request, response, next) => {
        console.log(`Error infos: ${request.method}, ${request.path}, ${error}`);
        if (!response.headersSent) {response.status(500).json({success: false, message: 'Internal Server Error. Please check console.'})};
    });
};