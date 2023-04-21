exports.ServerObject = class ServerObject {

    constructor() {
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.objectName = "ServerObject";
    }

    sendToClient(socket) {
        socket.emit("syncGameObject", {
            id: this.id,
            x: this.x,
            y: this.y,
            objectName: this.objectName
        });
    }

    sendToClients(io) {
        io.emit("syncGameObject", {
            id: this.id,
            x: this.x,
            y: this.y,
            objectName: this.objectName
        });
    }

}