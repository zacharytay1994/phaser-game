function preload() {
    // character assets
    this.load.image("player", "assets/characters/player.png");

    // environment assets
    this.load.image("tree", "assets/environment/tree1.png");

    // effect assets
    this.load.image("interaction", "assets/effects/interaction.png");

    // equipment animations 
    this.load.spritesheet('anim_axeswing', 'assets/effects/equipment/anim_axeswing.png', { frameWidth: 32, frameHeight: 32 });

    // monster animations
    this.load.spritesheet("monster_tree", "assets/characters/monsters/monster_tree.png", { frameWidth: 32, frameHeight: 32 });
}

function createAnimations(scene) {

    scene.anims.create({
        key: "anim_axeswing",
        frames: scene.anims.generateFrameNumbers("anim_axeswing", { frames: [0, 1, 2, 3, 4, 5] }),
        frameRate: 12,
        repeat: 0
    });

    scene.anims.create({
        key: "monster_tree",
        frames: scene.anims.generateFrameNumbers("monster_tree", { frames: [0, 1, 2, 3, 4, 5] }),
        frameRate: 6,
        repeat: -1
    });
}

function create() {
    createAnimations(this);
    this.socket = io();
    this.players = new ClientPlayers(this);
    this.clientObjects = new ClientObjects(this);
}

function update() {
    this.players.update();
    this.clientObjects.update();
}