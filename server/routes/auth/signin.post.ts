import { PrismaClient } from '@prisma/client'
import { z, ZodError } from 'zod'
import * as argon from 'argon2'
import { fromZodError } from 'zod-validation-error'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const config = useRuntimeConfig()

const prisma = new PrismaClient()

const SignInDto = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedBody = SignInDto.parse(body)
    const user = await prisma.user.findUnique({
      where: {
        email: validatedBody.email,
      },
    })
    if (!user) {
      event.node.res.statusCode = 404
      return { status: 'error', message: 'User not found' }
    } else if (!user.isVerified) {
      event.node.res.statusCode = 404
      return { status: 'error', message: 'User not found' }
    } else {
      const pwMatch = await argon.verify(user.password, validatedBody.password)
      if (!pwMatch) {
        event.node.res.statusCode = 401
        return { status: 'error', message: 'Invalid credentials' }
      }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        runtimeConfig.API_SECRET_KEY
      )
      return { token }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof ZodError) {
      event.node.res.statusCode = 422
      return { status: 'error', message: fromZodError(error) }
    }
    event.node.res.statusCode = 500
    return { status: 'error', message: 'Something went wrong' }
  }
})
