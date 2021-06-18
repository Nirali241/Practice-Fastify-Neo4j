async function routes (fastify, options) {

   

    fastify.post("/", async function(req, res){
        return {hello : `world........!!`};
    });

   
};

module.exports = routes;