const fastify = require("fastify");
const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

function routes(fastify, options, done) {
  fastify.post("/register", async (request, reply) => {
    const { username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword },
      });
      reply.send({ success: true, user: newUser });
    } catch (err) {
      reply.send({ success: false, message: "User registration failed" });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.send({
          success: false,
          message: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      reply.send({ success: true, token });
    } catch (err) {
      reply.send({ success: false, message: "Login failed" });
    }
  });

  fastify.get(
    "/accounts",
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const accounts = await prisma.account.findMany({
          where: { userId: request.user.id },
        });
        reply.send({ success: true, accounts });
      } catch (err) {
        reply.send({ success: false, message: "Failed to fetch accounts" });
      }
    }
  );

  fastify.get(
    "/accounts/:accountId/history",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { accountId } = request.params;

      try {
        const history = await prisma.paymentHistory.findMany({
          where: { accountId: parseInt(accountId) },
        });
        reply.send({ success: true, history });
      } catch (err) {
        reply.send({
          success: false,
          message: "Failed to fetch payment history",
        });
      }
    }
  );

  done();
}

module.exports = routes;
