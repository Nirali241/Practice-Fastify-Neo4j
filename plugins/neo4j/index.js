"use strict";

const fp = require("fastify-plugin");

const neo4j = require('neo4j-driver');

async function neo4jPlugin(fastify) {
  console.log("start.....................");
  try {
    
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Neo4j'));
    const session = driver.session({database:'example'});
    fastify.log.info("neo4j connection has been established successfully.");
    fastify.decorate("neo4jSession", session);
  } catch (e) {
    fastify.log.error(`neo4j connection failed....`);
    throw Error(`neo4j Connection Failed ${e}`);
  }
}

module.exports = fp(neo4jPlugin);