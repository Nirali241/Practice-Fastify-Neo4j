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
          const emp1 = `CREATE (emp:employee{name: '${name}', mobile_no: ${mobile_no}, salary: ${salary},joined: '${joined}'})`;
          await this.runWriteQuery(emp1);  
         
          console.log(`employee working........ ${name}`);
          return reply.code(201).send();
        } catch(e) {
          console.log(e);
          return reply.code(500).send(e);
        }
      }
    
    //Create Department Details
      async createDepartment(request, reply) {
        try {
          const name = request.body;
          const dep1 = `CREATE (dep:department{name: '${name}'})`;
          
          await this.runWriteQuery(dep1);  
          return reply.code(201).send();
        
        } catch(e) {
          console.log(e);
          return reply.code(500).send(e);
        }
      }
  
  //Create Relationship with department as well as employee    
    async createRelationshipwithNode(request, reply) {
       
       try {
        const empname = request.params.empname;
        const relationship = request.params.relationship;
        const type = request.params.type;
        const entity = request.params.entity;
        
        const result = await this.runWriteQuery(`MATCH (n:employee{name:"${empname}"}), (d:${type}{name:"${entity}"}) CREATE (n)-[w:${relationship}]->(d) RETURN n,w,d`);
        return reply.code(201).send({result});
       
      } catch(e) {
         console.log(e);
         return reply.code(500).send(e);
       }
      }

  //Using GET Methods.............

    //GET all employee name who works for specific department
      async getEmployeeValue(request, reply) {
        try{
        const departmentname = request.params.department;
        const result = await this.runReadQuery(`MATCH (e:employee)-[:worksfor]->(d:department{name:"${departmentname}"}) RETURN e`);
        console.log(result);
        return reply.code(200).send();

        } catch(e) {
          console.log(e);
          return reply.code(400);
        }
      };

    //GET all employee name who has some specific salary
      async getEmployeeSalary(request, reply) {
        try{
          const salary = request.params.salary;
          console.log(salary);
          const result = await this.runReadQuery(`MATCH (e:employee) WHERE e.salary>${salary} RETURN e.name`);
          console.log(result);
          return reply.code(200).send({result});
        } catch(e) {
          return reply.code(400);
        }
      }  

  //Using PATCH Method........

      async getUpdateAttributeValue(request, reply) {
        try{
          var name = request.params.name;
          console.log(name);
          
          if(name && request.body.mobile_no) {
            const mobile_no= request.body.mobile_no;
            await this.runWriteQuery(`MATCH (e:employee{name:"${name}"}) SET e.mobile_no=${mobile_no}  RETURN e`);
          }
          if(name && request.body.salary){
            const salary = request.body.salary;
            await this.runWriteQuery(`MATCH (e:employee{name:"${name}"}) SET e.salary=${salary} RETURN e`);
          }
          if(name && request.body.joined) {
            const joined = request.body.joined;
            await this.runWriteQuery(`MATCH (e:employee{name:"${name}"}) SET e.joined="${joined}" RETURN e`);
          }
          return reply.code(200).send();
        
        } catch(e) {
          return reply.code(304);
        }
      }

      async getupdateEmployeeRelation(request, reply) {
        try{
          const empname = request.body.empname;
          const relation = request.body.relation;
          const depname = request.body.depname;
          

          const result = await this.runWriteQuery(`MATCH (e:employee{name:"${empname}"}), (d:department{name:"${depname}"}) SET (e)-[r:${relation}]->(d) RETURN e,r,d`);
          return reply.code(200);
        } catch(e) {
          return reply.code(304);
        }
      }
      
}
module.exports = handler;