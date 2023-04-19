class Marker extends ClientOnlyObject {

    constructor(scene, socket, creatorId, x, y) {
        super("Marker", scene, socket, creatorId, x, y, "interaction");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.isCreator()) {
            console.log("i created this");
        }
    }
}