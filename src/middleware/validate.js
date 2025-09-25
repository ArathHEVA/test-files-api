import {  unprocessable } from '../utils/error.js'
export const validate = (schema, source = 'body') => async (req, _res, next) => {
  try {
    const data = await schema.validate(req[source], { abortEarly: false, stripUnknown: true })
    req[source] = data
    next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log(err.errors)
      return next(unprocessable('Validation failed', { errors: err.errors }))
    }
    next(err)
  }
}
