import { PrismaClient } from '@prisma/client'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

const config = useRuntimeConfig()

const ResendCodeDto = z.object({
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedBody = ResendCodeDto.parse(body)

    await prisma.userOTP.delete({
      where: {
        userEmail: validatedBody.email,
      },
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.userOTP.create({
      data: {
        userEmail: validatedBody.email,
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
    event.node.res.statusCode = 200
    return { 'status': 'success', 'message': 'Verification code sent.' }
  } catch (error) {
    if (error instanceof ZodError) {
      event.node.res.statusCode = 422
      return { 'status': 'error', 'message': fromZodError(error) }
    }
    event.node.res.statusCode = 500
    console.log(error)
    return { 'status': 'error', 'message': 'Something went wrong' }
  }
})
