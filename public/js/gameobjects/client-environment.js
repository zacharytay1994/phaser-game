class Tree extends ClientObject {

    constructor(scene, socket, id, x, y, texture) {
        super(scene, socket, id, x, y, texture);

        this.setInteractive();
        this.on("pointerdown", (pointer) => {
            this.clientDestroy();
        })
    }

}