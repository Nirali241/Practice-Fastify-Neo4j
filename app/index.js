// sample api plugin

"use strict";

const sampleRoute = require("./v1/sampleDemo");

// sample api plugin
module.exports = async function routes(fastify) {
  fastify.register(sampleRoute, { prefix: "/v1" });
};
