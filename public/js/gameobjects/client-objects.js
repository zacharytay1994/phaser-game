var clientObjects = (function () {

    // define client objects
    var objects = new Map([
        ["Tree", [ Tree, "tree" ]]
    ]);
    var instances = new Map();

    return {
        receiveFromServer: (scene, socket) => {
            socket.on("syncGameObject", (object) => {

                // create new object on client based on what server sent
                var newObject;
                console.log(object.objectName);
                if (objects.has(object.objectName)) {
                    var objectData = objects.get(object.objectName);
                    newObject = new objectData[0](scene, object.id, object.x, object.y, objectData[1]);
                }
                else {
                    newObject = new ClientObject(scene, object.id, object.x, object.y, object.objectName);
                }

                // add object to client object instances
                instances.set(object.id, newObject);
                scene.add.existing(newObject);
            });
        }
    }

})();