const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

async function authenticate(request, reply) {
  try {
    const token = request.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return reply
        .status(401)
        .send({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!request.user) {
      return reply
        .status(401)
        .send({ success: false, message: "User not found" });
    }

    reply.log.info("User authenticated");
  } catch (err) {
    reply.status(401).send({ success: false, message: "Invalid token" });
  }
}

module.exports = authenticate;
