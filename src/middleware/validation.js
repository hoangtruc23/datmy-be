const Joi = require('joi')
const pick = require('../utils/helper/pick')
const response = require('../utils/response/response')
const BadReq = require('../utils/response/requestError')

const validate = (schema) => (req, res, next) => {
    try {
        const validSchema = pick(schema, ['params', 'query', 'body'])
        const object = pick(req, Object.keys(validSchema))
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(object)

        if (error) {
            const errorMessage = error.details
                .map((details) => details.message)
                .join(', ')
            next(new BadReq({ message: errorMessage }))
        }
        Object.assign(req, value)
        return next()
    } catch (error) {
        next(response.serverError(error))
    }
}

module.exports = validate
