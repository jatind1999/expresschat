const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    res.send("404. Not Found!");
    next(error);
};

const errorHandler = (err, req, res, next) => {
    console.log("Error Handler Invoked");
    console.log(err);
    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // res.status(statusCode).json({
    //   message: err.message,
    //   stack: process.env.NODE_ENV === "production" ? null : err.stack,
    // });
};

module.exports = { notFound, errorHandler };
