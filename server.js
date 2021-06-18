//IMPORTS 
const fastify = require('fastify')();

//ROUTES  

const routes = require("./app");
const res = require("./routes");

const neo4jPlugin = require("./plugins/neo4j");
fastify.register(res);

function create() {
  
    fastify.register(neo4jPlugin);
    // custom routes set up
    fastify.register(routes);
    
  
  
    return fastify;
  }
  create();
 //LISTENER
fastify.listen(3000, function (err, address) {
    if(err) {
        console.log(err);
        process.exit(1);
    } else {
        
        console.log(`Server running on port...${address}`);
    }
});

