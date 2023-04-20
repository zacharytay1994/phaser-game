class ClientObjects {
    constructor(scene) {
        this.scene = scene;
        this.socket = scene.socket;

        this.objects = new Map([
            ["Marker", Marker],
            ["Tree", Tree],
            ["MonsterTree", MonsterTree]
        ]);

        this.instances = new Map();

        this.createGroups();
        this.receiveFromServer();
        this.receiveFromClients();
    }

    update() {
        this.overlapMarkerInteractable();
    }

    deleteInstanceFromMap(id) {
        this.instances.delete(id);
    }

    destroyInstance(id) {
        this.instances.get(id).destroy();
    }

    createGroups() {
        var scene = this.scene;
        // marker group for markers that interact with the world
        scene.markerGroup = scene.add.group();
        scene.markerGroup.enableBody = true;
        scene.markerGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // interactable group, for objects that can be interacted with by markers
        scene.interactableGroup = scene.add.group();
        scene.interactableGroup.enableBody = true;
        scene.interactableGroup.physicsBodyType = Phaser.Physics.ARCADE;
    }

    overlapMarkerInteractable() {
        this.scene.physics.overlap(this.scene.markerGroup, this.scene.interactableGroup, (marker, interactable) => {
            if (marker.startEvent) {
                Marker.types[marker.type].hitEvent(marker, interactable);
            }
        }, null, this.scene);
    }

    receiveFromServer() {
        var scene = this.scene;
        var socket = this.socket;
        var self = this;
        socket.on("syncGameObject", (object) => {

            // create new object on client based on what server sent
            var newObject;
            if (self.objects.has(object.objectName)) {
                var objectType = self.objects.get(object.objectName);
                newObject = new objectType(scene, socket, object.id, object.x, object.y);
            }
            else {
                newObject = new ClientObject(scene, socket, object.id, object.x, object.y, "none");
            }

            // add object to client object instances
            self.instances.set(object.id, newObject);
        });

        socket.on("deleteInstanceDestroyObject", (id) => {
            logger.logs("deleteInstanceDestroyObject", id);
            if (self.instances.has(id)) {
                self.destroyInstance(id);
                self.deleteInstanceFromMap(id);
            }
        });

        socket.on("deleteInstance", (id) => {
            logger.logs("deleteInstance", id);
            if (self.instances.has(id)) {
                self.deleteInstanceFromMap(id);
            }
        });
    }

    receiveFromClients() {
        var scene = this.scene;
        var socket = this.socket;
        var self = this;
        socket.on("createClientOnlyObject", (objectInfo) => {
            logger.logs("createClientOnlyObject", objectInfo);

            var newObject;
            if (self.objects.has(objectInfo.name)) {
                var objectType = self.objects.get(objectInfo.name);
                newObject = new objectType(scene, socket, objectInfo.creatorId, objectInfo.x, objectInfo.y, objectInfo.data);
            }
            else {
                newObject = new ClientOnlyObject(scene, socket, objectInfo.creatorId, objectInfo.x, objectInfo.y, "none");
            }
        });

        socket.on("createMarker", (marker) => {
            logger.logs("createMarker", marker);
            new Marker(scene, socket, marker.owner, marker.x, marker.y, marker.type);
            console.log(scene.markerGroup);
            console.log(scene.interactableGroup);
        });
    }
}