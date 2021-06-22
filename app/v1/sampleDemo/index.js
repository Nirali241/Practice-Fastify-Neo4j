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
    handler: node.createRelationshipWithEmployee.bind(node)
  });

  
  fastify.route({
    method: "GET",
    url: "/employee/:department",
    handler: node.getEmployeesOfDepartment.bind(node)
  });

  fastify.route({
    method: "GET",
    url: "/employee",
    handler: node.getAllEmployees.bind(node)
  });

  fastify.route({
    method: "PATCH",
    url: "/employee/:name",
    handler: node.UpdateEmployeeDetails.bind(node)
  });

  fastify.route({
    method: "PATCH",
    url: "/employee/:empname/:relation/:depname",
    handler: node.UpdateEmployeeRole.bind(node)
  })

  fastify.route({
    method:"DELETE",
    url: "/employee/:name",
    handler: node.DeleteEmployee.bind(node)
  })

};
