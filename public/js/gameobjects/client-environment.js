class Tree extends ClientObject {

    constructor(socket, scene, id, x, y, texture) {
        super(socket, scene, id, x, y, texture);

        this.setInteractive();
        this.on("pointerdown", (pointer) => {
            this.clientDestroy();
        })
    }

}