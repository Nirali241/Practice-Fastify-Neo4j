"use strict";

const Nodes = require("./handler");

module.exports = async function(fastify) {
    
const node = new Nodes(fastify);
 
  fastify.route({
    method: "POST",
    url: "/employee",
    // schema: sampleSchema,
    handler: node.createEmployee.bind(node)
  });
  fastify.route({
    method: "POST",
    url: "/department",
    // schema: sampleSchema,
    handler: node.createDepartment.bind(node)
  });
 
  fastify.route({
    method: "POST",
    url: "/employee/:empname/:relationship/:type/:entity",
    // schema: sampleSchema,
    handler: node.createRelationshipwithNode.bind(node)
  });

  
  fastify.route({
    method: "GET",
    url: "/employee/:department",
    handler: node.getEmployeeValue.bind(node)
  });

  fastify.route({
    method: "GET",
    url: "/employee",
    handler: node.getEmployeeSalary.bind(node)
  });

  fastify.route({
    method: "PATCH",
    url: "/employee/:name",
    handler: node.getUpdateAttributeValue.bind(node)
  });

  fastify.route({
    method: "PATCH",
    url: "/employee/:empname/:relation/:depname",
    handler: node.getupdateEmployeeRelation.bind(node)
  })

  fastify.route({
    method:"DELETE",
    url: "/employee",
    handler: node.getDeleteAttributeNode.bind(node)
  })

};
