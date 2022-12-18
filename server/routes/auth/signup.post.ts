import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    await prisma.user.create({
      data: body,
    })
    event.node.res.statusCode = 201
    return 'Created'
  } catch (error) {
    const typedError = error as Error
    return sendError(event, typedError)
  }
})
