import Fastify from "fastify"
import ShortUniqueId from "short-unique-id"
import { fastifyCors } from "@fastify/cors"
import client from "./lib/prisma.js"

const netlifyApp = ["https://meek-dusk-1e55a9.netlify.app"]
const fastify = Fastify({
  logger: false,
})

fastify.register(fastifyCors, {
  origin: ["http://localhost:4321"].concat(netlifyApp),
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

  return { result: `https://url-shortener-api-8x2k.onrender.com/${shortUrl}` }
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

export default async function handler(req, reply) {
  await fastify.ready()
  fastify.server.emit("request", req, reply)
}
