const Joi = require('joi')
const { HttpCode } = require('../constants')

const schemaRegistration = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().alphanum().min(5).max(12).required(),
  name: Joi.string().alphanum().min(3).max(20),
  sex: Joi.string(),
})

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)

  if (error) {
    const [{ message }] = error.details

    return next({
      status: HttpCode.BAD_REQUEST,
      code: HttpCode.BAD_REQUEST,
      data: 'Bad Request',
      message: `Filed: ${message.replace(/"/g, '')}`,
    })
  }

  next()
}

module.exports.reg = (req, res, next) => {
  return validate(schemaRegistration, req.body, next)
}

module.exports.login = (req, res, next) => {
  return validate(schemaLogin, req.body, next)
}
