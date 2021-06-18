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
//Using GET Methods.............

    async getAttributesValue(request, reply) {
      const name = request.params.department;
    //Display employee name who works for particular department
      const result = await this.runReadQuery(`MATCH (e:employee)-[:worksfor]->(d:department{name:"${name}"}) RETURN e.name`);
      console.log(result);
      return reply.code(200).send({result});
    };

    async getAttributesSalary(request, reply) {
      const salary = request.params.salary;
      //Display employee who's salary is greater than 20,000
      const result = await this.runReadQuery(`MATCH (e:employee) WHERE e.salary>${salary} RETURN e.name`);
      console.log(result);
      return reply.code(200).send({result});
    }

//Using POST Methods.............

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
    
      async createDepartment(request, reply) {
        try {
          //creating object
          const {name} = request.body;
          //passing variable value through template string.....
          const dep1 = `CREATE (dep:department{name: '${name}'})`;
          await this.runWriteQuery(dep1);  
          console.log(`department working........ ${name}`);
         
          return reply.code(201).send();
        } catch(e) {
          console.log(e);
          return reply.code(500).send(e);
        }
      }

      async setAttributeValue(request, reply) {
        const name = request.params.name;
        
          await this.runWriteQuery(`MATCH (n:department{name:'${name}'}) RETURN n`);
          console.log(`department name working........ ${name}`);
      
        return reply.code(201).send();
      }

      async setAttributeValueGlobally(request, reply) {
        const type = request.params.type;
        const empname = request.params.empname;
        const relation = request.params.relationship;
        const depname = request.params.depname;

            
        const result = await this.runWriteQuery(`MATCH (n:employee{name:"${empname}"}), (d:department{name:"${depname}"}) CREATE (n)-[:${relation}]->(d) RETURN n,d`);
        console.log(`employee working........ ${result}`);
        return reply.code(201).send({result});
      }

      async setAttributeValuesecondlevel(request, reply) {
        const empname = request.params.empname;
        const relation = request.params.relationship;
        const emp = request.params.emp;
        
        const result = await this.runWriteQuery(`MATCH (n:employee{name:"${empname}"}), (e1:employee{name:"${emp}"}) CREATE (n)-[:${relation}]->(e1) RETURN n,e1`);
        console.log(`employee working........ ${result}`);
        return reply.code(201).send({result});
      }

  //Using PATCH Method........

      async getUpdateAttributeValue(request, reply) {
        var name = request.params.update;
        
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
        
        return reply.code(201).send();
      }

      
}
module.exports = handler;