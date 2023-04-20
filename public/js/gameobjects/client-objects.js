var clientObjects = (function () {

    // define client objects
    var objects = new Map([
        ["Marker", Marker],
        ["Tree", Tree]
    ]);
    var instances = new Map();

    function deleteInstanceFromMap(id) {
        instances.delete(id);
    }

    function destroyInstance(id) {
        instances.get(id).destroy();
    }

    return {
        receiveFromServer: (scene) => {
            var socket = scene.socket;
            socket.on("syncGameObject", (object) => {

                // create new object on client based on what server sent
                var newObject;
                if (objects.has(object.objectName)) {
                    var objectType = objects.get(object.objectName);
                    newObject = new objectType(scene, socket, object.id, object.x, object.y);
                }
                else {
                    newObject = new ClientObject(scene, socket, object.id, object.x, object.y, "none");
                }

                // add object to client object instances
                instances.set(object.id, newObject);
                scene.add.existing(newObject);
            });

            socket.on("deleteInstanceDestroyObject", (id) => {
                logger.logs("deleteInstanceDestroyObject", id);
                if (instances.has(id)) {
                    destroyInstance(id);
                    deleteInstanceFromMap(id);
                }
            });

            socket.on("deleteInstance", (id) => {
                logger.logs("deleteInstance", id);
                if (instances.has(id)) {
                    deleteInstanceFromMap(id);
                }
            });
        },
        receiveFromClients: (scene) => {
            var socket = scene.socket;
            socket.on("createClientOnlyObject", (objectInfo) => {
                logger.logs("createClientOnlyObject", objectInfo);

                var newObject;
                if (objects.has(objectInfo.name)) {
                    var objectType = objects.get(objectInfo.name);
                    newObject = new objectType(scene, socket, objectInfo.creatorId, objectInfo.x, objectInfo.y, objectInfo.data);
                }
                else {
                    newObject = new ClientOnlyObject(scene, socket, objectInfo.creatorId, objectInfo.x, objectInfo.y, "none");
                }
            });

            socket.on("createMarker", (marker) => {
                logger.logs("createMarker", marker);
                new Marker(scene, socket, marker.owner, marker.x, marker.y, marker.type);
            });
        }
    }

})();