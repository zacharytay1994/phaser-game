class MonsterTree extends ClientObject {

    constructor(scene, socket, id, x, y) {
        super(scene, socket, id, x, y, "monster_tree");

        this.play("monster_tree");
        this.setScale()
    }

}