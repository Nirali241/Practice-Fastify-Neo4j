class handler {

    constructor(fastify) {
      this.fastify = fastify
    }
    runReadQuery(query, params = {}) {
      return this.fastify.neo4jSession.readTransaction(txc => txc.run(query, params)).then(res => res);
    }
    runWriteQuery(query, params = {}) {
      return this.fastify.neo4jSession.writeTransaction(txc => txc.run(query, params)).then(res => res);
    }

//Using POST Methods.............

    //Create Employee Deatils
      async createEmployee(request, reply) {
        try {
          const {name,mobile_no,salary,joined} = request.body;
          const result = `CREATE (emp:employee{name: '${name}', mobile_no: ${mobile_no}, salary: ${salary},joined: '${joined}'})`;
          await this.runWriteQuery(result);  
          //CREATED Successfully
          return reply.code(201).send(); 
        
        } catch(e) {
          console.log(e);
          // Internal Server Error
          return reply.code(500).send(e);
        }
      }
    
    //Create Department Details
      async createDepartment(request, reply) {
        try {
          const name = request.body;
          const result = `CREATE (dep:department{name: '${name}'})`;
          
          await this.runWriteQuery(result);  
          return reply.code(201).send();
        
        } catch(e) {
          return reply.code(500).send(e);
        }
      }
  
  //Create Relationship with department as well as employee    
    async createRelationshipWithEmployee(request, reply) {
       
       try {
        const empName = request.params.empname;
        const relationship = request.params.relationship;
        const type = request.params.type;
        const entity = request.params.entity;
        
        await this.runWriteQuery(`MATCH (n:employee{name:"${empName}"}), (d:${type}{name:"${entity}"}) CREATE (n)-[w:${relationship}]->(d) RETURN n,w,d`);
        return reply.code(201).send();
       
      } catch(e) {
         console.log(e);
         return reply.code(500).send(e);
         // Internal Server Error 500
         // 404 Not Found 
       }
      }

  //Using GET Methods.............

    //GET all employee name who works for specific department
      async getEmployeesOfDepartment(request, reply) {
        try{
        const departmentName = request.params.department;
        const result = await this.runReadQuery(`MATCH (e:employee)-[:worksfor|:manage]->(d:department{name:"${departmentName}"}) RETURN e.name`);
        console.log(result);
        //OK request has succeeded
        return reply.code(200).send(result.records.map((employeeName) => employeeName._fields[0]));

        } catch(e) {
          console.log(e);
          return reply.code(500);
          // Internal Server Error 500
         // 404 Not Found 
         // 400 bad request
        }
      };

    //GET all employee name who has some specific salary
      async getAllEmployees(request, reply) {
        try{
          const salary = request.query.salary;
          console.log(salary);
          const result = await this.runReadQuery(`MATCH (e:employee) WHERE e.salary>${salary} RETURN e.name`);
          return reply.code(200).send(result.records.map((employeeName) => employeeName._fields[0]));
        
        } catch(e) {
          return reply.code(400);

        }
      }  

  //Using PATCH Method........

      async UpdateEmployeeDetails(request, reply) {
        try{
          const name = request.params.name;
          const data = request.body;
          //console.log("THis is what i need.............",data);
          for(const property in data) {
            //console.log(`${property} = ${data[property]}`);
            await this.runWriteQuery(`MATCH (e:employee{name:"${name}"}) SET e.${property} = ${data[property]} RETURN e`);
          }
          return reply.code(200).send();
        
        } catch(e) {
          console.log(e);
          return reply.code(500);
        }
      }

      async UpdateEmployeeRole(request, reply) {
        try{
          const empName = request.params.empname;
          const relation = request.params.relation;
          const depName = request.params.depname;
          
          await this.runWriteQuery(`MATCH (e:employee{name:"${empName}"}), (d:department{name:"${depName}"}) SET (e)-[r:${relation}]->(d) RETURN e,r,d`);
          return reply.code(200);
        
        } catch(e) {
          return reply.code(500);
        }
      }
      
      async DeleteEmployee(request, reply) {
        try{
          const empName = request.params.name;

          await this.runWriteQuery(`MATCH (e:employee{name:"${empName}"}) DETACH DELETE e`);
          return reply.code(200);
        
        } catch(e) {
          // Not Found 404
          // Internal server error 500
          return reply.code(500);  
        }
      }
}
module.exports = handler;