class ClientOnlyObject extends Phaser.GameObjects.Sprite {

    constructor(name, scene, socket, creatorId, x, y, texture) {
        super(scene, x, y);
        this.name = name;
        this.scene = scene;
        this.socket = socket;
        this.creatorId = creatorId;
        this.setTexture(texture);
        this.setPosition(x, y);
        this.data = {};

        scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    sendToClients() {
        this.socket.emit("createClientOnlyObject", {
            name: this.name,
            creatorId: this.creatorId,
            x: this.x,
            y: this.y,
            data: this.data
        });
    }

    isCreator() {
        return this.socket.id == this.creatorId;
    }
}