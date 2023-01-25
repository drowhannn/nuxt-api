import { PrismaClient } from '@prisma/client'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

const prisma = new PrismaClient()

const VerifyCodeDto = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedBody = VerifyCodeDto.parse(body)

    const userOtp = await prisma.userOTP.findUnique({
      where: {
        userEmail: validatedBody.email,
      },
    })
    if (!userOtp) {
      throw new Error('User not found')
    } else {
      if (userOtp.expiresAt < new Date()) {
        throw new Error('OTP expired')
      } else {
        if (userOtp.otp === validatedBody.code) {
          await prisma.userOTP.delete({
            where: {
              userEmail: validatedBody.email,
            },
          })
          await prisma.user.update({
            where: {
              email: validatedBody.email,
            },
            data: {
              isVerified: true,
            },
          })
          return {
            'status': 'success',
            'message': 'User verified',
          }
        }
      }
    }
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
