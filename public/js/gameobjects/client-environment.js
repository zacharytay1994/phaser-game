class Tree extends ClientObject {

    constructor(scene, socket, id, x, y) {
        super(scene, socket, id, x, y, "tree");

        // scene.physics.add.existing(this);

        // this.setInteractive();
        // this.on("pointerdown", (pointer) => {
        //     this.clientDestroy();
        // })
    }

}