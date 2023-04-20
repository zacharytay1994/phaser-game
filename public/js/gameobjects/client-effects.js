class Marker extends Phaser.Physics.Arcade.Sprite {

    static names = {
        "AxeBasic": 1
    }
    static types = {
        1: {
            baseSprite: "interaction",
            eventSprite: "anim_axeswing",
            eventDelay: 1000,
            hitEvent: (self, other) => {
                if (!self.hitLog.has(other.id)) {
                    // only the owner of the marker should execute this part of the code, on hit events sent to the server
                    if (self.isOwner()) {
                        other.clientDestroy();
                    }
                    self.hitLog.set(other.id, true);
                }
            },
            endAnimationEvent: (scene) => {
                console.log("animation ended");
            }
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
            this.startEvent = false;
            this.animation = null;
            this.toDestroy = false;
            this.hitLog = new Map();

            var config = Marker.types[type];
            this.setTexture(config.baseSprite);
            this.setPosition(x, y);

            scene.physics.add.existing(this);
            scene.add.existing(this);
            scene.markerGroup.add(this);

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

    isOwner() {
        return this.socket.id == this.owner;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.toDestroy) {
            this.scene.time.delayedCall(100, (self) => { self.destroy(); }, [this]);
        }

        // any update
        if (!this.startEvent) {
            if (this.eventDelay > 0.0) {
                this.eventDelay -= delta;
            }
            else if (this.animation == null) {
                // create event sprite upon event ending
                this.animation = new myAnimation(this.scene, this.x, this.y, Marker.types[this.type].eventSprite);
            }
        }

        if (this.animation != null && this.animation.done) {
            this.animation.destroy();
            this.animation = null;
            this.startEvent = true;
            Marker.types[this.type].endAnimationEvent(this.scene);
            this.toDestroy = true;
        }
    }
}