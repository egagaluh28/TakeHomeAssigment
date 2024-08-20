const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAccounts = async (request, reply) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: request.user.id },
    });
    reply.send({ success: true, accounts });
  } catch (err) {
    reply.send({ success: false, message: "Failed to fetch accounts" });
  }
};

exports.getAccountHistory = async (request, reply) => {
  const { accountId } = request.params;

  try {
    const history = await prisma.paymentHistory.findMany({
      where: { accountId: parseInt(accountId) },
    });
    require("dotenv").config();
    const Fastify = require("fastify");
    const fastify = Fastify({ logger: true });

    fastify.register(require("@fastify/cors"));

    // Register your routes
    fastify.register(require("./routes/accountRoutes"));

    // Start server
    const start = async () => {
      try {
        await fastify.listen({ port: process.env.PORT || 3000 });
        fastify.log.info(
          `Server listening on port ${fastify.server.address().port}`
        );
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    };

    start();

    reply.send({ success: true, history });
  } catch (err) {
    reply.send({ success: false, message: "Failed to fetch payment history" });
  }
};
