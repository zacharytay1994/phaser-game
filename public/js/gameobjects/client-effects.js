class Marker extends Phaser.GameObjects.Sprite {

    static names = {
        "AxeBasic": 1
    }
    static types = {
        1: {
            baseSprite: "interaction",
            eventSprite: "anim_axeswing",
            eventDelay: 1000
        }
    }

    constructor(scene, socket, owner, x, y, type) {

        try {
            super(scene, x, y);

            // set primary marker properties
            this.scene = scene;
            this.socket = socket;
            this.owner = owner;
            this.type = type;

            var config = Marker.types[type];
            this.setTexture(config.baseSprite);
            this.setPosition(x, y);

            scene.add.existing(this);

            // set secondary marker properties
            this.eventDelay = config.eventDelay;
        }
        catch (e) {
            logger.loge(e.stack);
        }

    }

    sendToClients() {
        this.socket.emit("createMarker", {
            type: this.type,
            owner: this.owner,
            x: this.x,
            y: this.y
        });
    }

    isCreator() {
        return this.socket.id == this.owner;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // creator only update
        if (this.isCreator()) {
            // console.log("i created this");
        }

        // any update
        if (this.eventDelay > 0.0) {
            this.eventDelay -= delta;
        }
        else {
            // create event sprite upon event ending
            new myAnimation(this.scene, this.x, this.y, Marker.types[this.type].eventSprite);
            this.destroy();
        }
    }
}