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
    url: "/department/:name",
    // schema: sampleSchema,
    handler: node.setAttributeValue.bind(node)
  });

  fastify.route({
    method: "POST",
    url: "/employee/:empname/:relationship/:depname",
    // schema: sampleSchema,
    handler: node.setAttributeValueGlobally.bind(node)
  });

  fastify.route({
    method: "POST",
    url: "/employeesecond/:empname/:relationship/:emp",
    // schema: sampleSchema,
    handler: node.setAttributeValuesecondlevel.bind(node)
  });

  fastify.route({
    method: "GET",
    url: "/employeelist/:department",
    handler: node.getAttributesValue.bind(node)
  });

  fastify.route({
    method:"GET",
    url:"/employee/:salary",
    handler: node.getAttributesSalary.bind(node)
  });

  fastify.route({
    method:"PATCH",
    url:"/employee/:update",
    handler: node.getUpdateAttributeValue.bind(node)
  });

};
