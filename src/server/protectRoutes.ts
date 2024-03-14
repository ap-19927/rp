//https://masteringnuxt.com/blog/protecting-server-routes

import { getToken } from '#auth'

export default async (event) => {
  const token = await getToken({ event })
  if (!token) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }
}
