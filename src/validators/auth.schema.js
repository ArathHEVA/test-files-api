import * as yup from 'yup'

export const registerSchema = yup.object({
  email: yup.string().trim().email().required(),
  password: yup.string().min(8).required("Minimo 8 caracteres"),
  name: yup.string().trim().max(80).required()
})

export const loginSchema = yup.object({
  email: yup.string().trim().email().required(),
  password: yup.string().required()
})
