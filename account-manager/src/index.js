require('dotenv').config();
const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const cors = require('@fastify/cors');
const authenticate = require('./middleware/authenticate');

// Register plugins
fastify.register(cors, { origin: '*' });

// Register routes
fastify.register(require('./routes/accountRoutes'));

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    fastify.log.info(`Server listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
