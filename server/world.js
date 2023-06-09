exports.world = (function () {

    var logger = require("./logger.js").logger;
    var serverObjects = require("./gameobjects/server-objects.js").serverObjects;

    const cellSize = 32;
    const worldSize = 20;
    const noise = require("./perlin.js").noise.noise;
    const density = 0.35;

    return {
        generate: (io) => {
            logger.logi("generating world ...");

            // use perlin noise generate trees
            for (var x = 0; x < worldSize; ++x) {
                for (var y = 0; y < worldSize; ++y) {
                    var value = noise.simplex2(x,y);
                    if (value > density) {
                        serverObjects.newObject(io, cellSize * x, cellSize * y, "Tree");
                    }
                    else if (value < -0.85) {
                        serverObjects.newObject(io, cellSize * x, cellSize * y, "MonsterTree");
                    }
                }
            }

            serverObjects.logInstances();
        },
        sendToClient: (socket) => {
            logger.logi("sending world to client " + socket.id);
            serverObjects.sendObjectsToClient(socket);
        },
        handleClientRequests: (socket) => {
            serverObjects.receiveFromClient(socket);
        }
    }
})();