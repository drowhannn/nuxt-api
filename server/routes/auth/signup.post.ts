import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

const prisma = new PrismaClient()

const userSignUpData = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().regex(/^[a-zA-Z]+\s[a-zA-Z]+$/),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedBody = userSignUpData.parse(body)
    await prisma.user.create({
      data: validatedBody,
    })
    event.node.res.statusCode = 201
    return { 'success': 'User created' }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        event.node.res.statusCode = 409
        return { 'error': 'Email already exists' }
      }
    }
    if (error instanceof ZodError) {
      event.node.res.statusCode = 422
      return { 'error': fromZodError(error) }
    }
    return { 'error': 'Something went wrong' }
  }
})
