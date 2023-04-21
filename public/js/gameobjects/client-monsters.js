class Monster extends ClientObject {

    // static states = {
    //     "Idle": 1,
    //     "Attack": 2
    // }

    constructor(scene, socket, id, x, y, texture) {
        super(scene, socket, id, x, y, texture);
        this.play(texture);

        // get player
        this.player = scene.players.player;

        this.state = "Idle";
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class MonsterTree extends Monster {

    constructor(scene, socket, id, x, y) {
        super(scene, socket, id, x, y, "monster_tree_idle");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.player != null) {
            if (lengthSq(this.x,this.y,this.player.x, this.player.y) < 64.0*64.0) {
                if (this.state != "Attack") {
                    this.state = "Attack";
                    this.play("monster_tree_attack");
                    console.log("attack state");
                }
            }
            else {
                if (this.state != "Idle") {
                    this.state = "Idle";
                    this.play("monster_tree_idle");
                    console.log("idle state");
                }
            }
        }
    }

}