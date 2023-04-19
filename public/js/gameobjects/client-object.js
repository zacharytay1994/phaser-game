class ClientObject extends Phaser.GameObjects.Sprite {

    constructor(socket, scene, id, x, y, texture) {
        super(scene, x, y);

        this.socket = socket;
        this.id = id;
        this.setTexture(texture);
        this.setPosition(x, y);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
 
    clientDestroy() {
        this.socket.emit("deleteInstanceDestroyObject", this.id);
        // destroy for this client first, client side prediction, assume always true
        this.destroy();
    }
}