//https://masteringnuxt.com/blog/protecting-server-routes

import { getServerSession } from "#auth"

export default async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 })
  }
}
