class myAnimation extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, animation) {
        super(scene, x, y);

        scene.add.existing(this);
        this.play(animation);

        // remove animation on complete
        this.on("animationcomplete", () => {
            this.destroy();
        })
    }

}