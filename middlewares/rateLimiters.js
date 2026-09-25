const rateLimit = require("express-rate-limit")

const askLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5
})

module.exports = {askLimiter, uploadLimiter};