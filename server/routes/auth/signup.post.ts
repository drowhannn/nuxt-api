import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler((event) => {
  console.log('signup')
  return 'ge'
})
