class ClientObject extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, socket, id, x, y, texture) {
        super(scene, x, y);

        this.scene = scene;
        this.socket = socket;
        this.id = id;
        this.setTexture(texture);
        this.setPosition(x, y);
        this.creator = 0;

        scene.physics.add.existing(this);
        scene.add.existing(this);
        scene.interactableGroup.add(this);
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