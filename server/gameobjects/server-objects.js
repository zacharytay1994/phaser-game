exports.serverObjects = (function () {

    var logger = require("../logger.js").logger;

    // define server objects
    var objects = new Map([
        ["ServerObject", require("./server-object.js").ServerObject],
        ["Tree", require("./server-environment.js").Tree]
    ])
    var instances = new Map();
    var uid = 0;

    return {
        newObject: (io, x, y, object) => {

            // create new object
            var newObject;
            if (objects.has(object)) {
                newObject = new (objects.get(object))();
                newObject.objectName = object;
            }
            else {
                newObject = new (objects.get("ServerObject"))();
            }
            newObject.id = uid;
            newObject.x = x;
            newObject.y = y;

            // send new object to all clients
            newObject.sendToClients(io);

            // add object to server object instances
            instances.set(uid, newObject);

            ++uid;
            return newObject;
        },
        sendObjectsToClient: (socket) => {
            instances.forEach((value, key) => {
                value.sendToClient(socket);
            });
        },
        sendObjectsToClients: (io) => {
            instances.forEach((value, key) => {
                value.sendToClients(io);
            });
        },
        logInstances() {
            var output = "logging server objects: \n\n";
            instances.forEach((value, key) => {
                output += "\t" + key + ": " + value + "\n";
            });
            logger.logi(output);
        }
    }
})();