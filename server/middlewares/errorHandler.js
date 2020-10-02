const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        case "SequelizeValidationError":
            res.status(400).json({
                name: 'Bad Request',
                message: err.message
            })
            break;
        case "BadRequest":
            res.status(400).json({
                name: 'Bad Request',
                message: err.message
            })
            break;
        case "NotFound":
            res.status(404).json({
                name: 'Not Found',
                message: err.message
            })
            break;
        case "Unauthorized":
            res.status(401).json({
                name: 'Unauthorized',
                message: err.message
            })
            break;
        default:
            res.status(500).json({
                name: 'Internal Server Error',
                message: err.message
            })
            break;
    }
}

module.exports = errorHandler