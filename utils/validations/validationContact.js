const Joi = require('joi')
const { HttpCode } = require('../constants')

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  phone: Joi.string().alphanum().min(7).max(12).required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .optional(),
  phone: Joi.string().alphanum().min(7).max(12).optional(),
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

module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
