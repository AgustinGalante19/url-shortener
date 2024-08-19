import Fastify from 'fastify';
import client from './src/client/prisma.js';
import ShortUniqueId from 'short-unique-id';
import { fastifyCors } from '@fastify/cors';

const port = process.env.PORT || 3000;
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`;
const ALLOWED_ORIGINS = [
  'https://meek-dusk-1e55a9.netlify.app',
  'https://short-it-rn.netlify.app/',
];
const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyCors, {
  origin: ['http://localhost:4321'].concat(ALLOWED_ORIGINS),
  methods: ['POST'],
});

fastify.get('/', () => {
  return 'Welcome to url shortener by Agustin Galante';
});

fastify.get('/urls', async (_, res) => {
  const shortenedUrls = await client.url.findMany();
  return res.send({ result: shortenedUrls });
});

fastify.post('/shortUrl', async (req, res) => {
  const { fullUrl } = req.body;

  const exists = await client.url.findFirst({
    where: {
      fullUrl,
    },
  });
  if (exists) {
    return res.code(400).send({
      message: `This url has already shortened`,
      result: `https://short-it-ag19.vercel.app/${exists.shortUrl}`,
    });
  }
  const shortUrl = new ShortUniqueId({ length: 10 }).rnd();
  await client.url.create({
    data: {
      fullUrl,
      shortUrl,
    },
  });

  return res.send({
    message: `Url generated successfully`,
    result: `https://short-it-ag19.vercel.app/${shortUrl}`,
  });
});

fastify.get('/:shortUrl', async (req, reply) => {
  try {
    const shortUrl = await client.url.findMany({
      where: {
        shortUrl: {
          equals: req.params.shortUrl,
        },
      },
    });
    if (shortUrl.length === 0) return reply.status(404).send('not found');
    return reply.redirect(shortUrl.at(0).fullUrl);
  } catch (err) {
    return 'error';
  }
});

fastify.listen({ host, port }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
