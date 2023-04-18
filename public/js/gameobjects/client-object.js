class ClientObject extends Phaser.GameObjects.Sprite {

    constructor(scene, id, x, y, texture) {
        super(scene, x, y);

        this.id = id;
        this.setTexture(texture);
        this.setPosition(x, y);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    destroy(socket) {
        socket.broadcast.emit("destroy", this.id);
    }
}