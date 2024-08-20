const fastify = require("fastify")();
const prisma = require("@prisma/client").PrismaClient;
const dotenv = require("dotenv");
dotenv.config();

fastify.get("/", async (request, reply) => {
  reply.send({ message: "Payment Manager Service is running" });
});

fastify.post("/send", async (request, reply) => {
  // Logika untuk mengirim uang
});

fastify.post("/withdraw", async (request, reply) => {
  // Logika untuk menarik uang
});

const start = async () => {
  try {
    await fastify.listen(3002); // Jalankan di port 3002
    console.log("Payment Manager running at http://localhost:3002");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
