import Fastify from "fastify"
import client from "./src/client/prisma.js"
import ShortUniqueId from "short-unique-id"
import { fastifyCors } from "@fastify/cors"

const port = process.env.PORT || 3000
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`
const ALLOWED_ORIGINS = ["https://meek-dusk-1e55a9.netlify.app"]
const fastify = Fastify({
  logger: false,
})

fastify.register(fastifyCors, {
  origin: ["http://localhost:4321"].concat(ALLOWED_ORIGINS),
  methods: ["POST"],
})
fastify.get("/", () => {
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

  return { result: `https://short-it-ag19.vercel.app/${shortUrl}` }
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

fastify.listen({ host, port }, function (err, _address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
