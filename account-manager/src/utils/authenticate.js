const jwt = require("jsonwebtoken");

module.exports = async (request, reply) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (err) {
    reply.send(err);
  }
};
