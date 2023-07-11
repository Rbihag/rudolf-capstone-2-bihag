// captures any unhandled errors that occur during the request processing and sends an appropriate JSON response with the error message and stack trace. It helps in centralizing error handling and providing consistent error responses in the application.

// not found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// error handler
const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
};

module.exports = { errorHandler, notFound };