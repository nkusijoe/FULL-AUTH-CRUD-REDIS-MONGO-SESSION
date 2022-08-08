const {BadRequest} = require('http-errors')
const errorHandler =  (err, req, res, next) => {
    console.log(err)

    let error = Object.assign(err, {})

    if(err.name === 'CastError') {
        error = new BadRequest('invalid object id provided')
    }
    

    res.status(error.statusCode || 500).json({
        success: false, 
        message: error.message
    })

}

module.exports = errorHandler