const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.register = async (request, reply) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    reply.send({ success: true, user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    reply.send({ success: false, message: "User registration failed" });
  }
};

exports.login = async (request, reply) => {
  const { username, password } = request.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      console.log("User not found:", username);
      return reply.send({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("User found:", user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return reply.send({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return reply.send({ success: false, message: "Internal server error" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    reply.send({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    reply.send({ success: false, message: "Login failed" });
  }
};
