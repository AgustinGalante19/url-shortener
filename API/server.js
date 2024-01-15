import Fastify from "fastify"
import client from "./src/client/prisma.js"
import ShortUniqueId from "short-unique-id"

const fastify = Fastify({
  logger: true,
})

fastify.get("/", () => {
  console.log(fastify.listeningOrigin)
  return "Welcome to url shortener by Agustin Galante"
})

fastify.post("/shortUrl", async (req) => {
  const { fullUrl } = req.body
  const shortUrl = new ShortUniqueId({ length: 10 }).rnd()
  await client.url.create({
    data: {
      fullUrl,
      shortUrl,
    },
  })

  return { method: "post", result: shortUrl }
})

fastify.get("/:shortUrl", async (req, reply) => {
  try {
    const shortUrl = await client.url.findMany({
      where: {
        shortUrl: {
          equals: req.params.shortUrl,
        },
      },
    })
    if (shortUrl.length === 0) return reply.status(404).send("not found")
    return reply.redirect(shortUrl.at(0).fullUrl)
  } catch (err) {
    return "error"
  }
})

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || "127.0.0.1",
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
