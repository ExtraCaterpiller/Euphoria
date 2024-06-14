module.exports = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}

/* 
    this code is a utility function that takes an Express route handler middleware function as input, 
    wraps it with error handling logic, and returns a new middleware function that can be used in an Express application. 
    This ensures that any asynchronous errors thrown by the route handler middleware are properly caught and forwarded to the error handling middleware.
*/