

module.exports = function (server, port) {
    'use strict';
    let cluster = require('cluster'),
        os = require('os'),
        /*
         * ClusterServer object 
         */
        ClusterServer = {
            name: 'ClusterServer',

            cpus: os.cpus().length,

            autoRestart: true, // Restart threads on death?

            start: function (server, port) {
                var me = this,
                    i;

                if (cluster.isMaster) { // fork worker threads
                    for (i = 0; i < me.cpus; i += 1) {
                        // console.log(me.name + ': starting worker thread #' + i);
                        cluster.fork();
                    }

                    cluster.on('death', function (worker) {
                        // Log deaths! 
                        if (me.autoRestart) {
                            // console.log(me.name + ': Restarting worker thread...');
                            cluster.fork();
                        }
                    });
                } else {
                    // Worker threads run the server
                    server.listen(port);
                }
            }
        }


    ClusterServer.name = 'emr server'; // rename ClusterServer instance
    ClusterServer.start(server, port); // Start it up!
} 