import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import * as argon from 'argon2'
import nodemailer from 'nodemailer'

const config = useRuntimeConfig()

const prisma = new PrismaClient()

const SignUpDto = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  name: z.string().regex(/^[a-zA-Z]+\s[a-zA-Z]+$/),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedBody = SignUpDto.parse(body)
    validatedBody.password = await argon.hash(validatedBody.password)

    // delete any previous instances user has previously tried to sign up and failed
    const duplicateUser = await prisma.user.findUnique({
      where: {
        email: validatedBody.email,
      },
    })
    if (duplicateUser && !duplicateUser.isVerified) {
      await prisma.userOTP.delete({
        where: {
          userEmail: duplicateUser.email,
        },
      })
      await prisma.user.delete({
        where: {
          id: duplicateUser.id,
        },
      })
    }

    //create new user
    const user = await prisma.user.create({
      data: validatedBody,
    })

    //save and send otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.userOTP.create({
      data: {
        userEmail: user.email,
        otp: otp,
        expiresAt: new Date(Date.now() + 3600 * 60 * 1000),
      },
    })
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.ETHEREAL_EMAIL,
        pass: config.ETHEREAL_PASSWORD,
      },
    })
    await transporter.sendMail({
      from: `"Rohan Dhimal" <rohan@gmail.com>`,
      to: validatedBody.email,
      subject: 'Verify your email',
      text: otp,
    })

    //send response
    event.node.res.statusCode = 201
    return { 'status': 'success', 'message': 'Verification code sent.' }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        event.node.res.statusCode = 409
        return { 'status': 'error', 'message': 'Email already exists' }
      }
    }
    if (error instanceof ZodError) {
      event.node.res.statusCode = 422
      return { 'status': 'error', 'message': fromZodError(error) }
    }
    event.node.res.statusCode = 500
    console.log(error)
    return { 'status': 'error', 'message': 'Something went wrong' }
  }
})
