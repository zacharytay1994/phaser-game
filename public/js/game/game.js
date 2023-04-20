function preload() {
    // character assets
    this.load.image("player", "assets/characters/player.png");

    // environment assets
    this.load.image("tree", "assets/environment/tree1.png");

    // effect assets
    this.load.image("interaction", "assets/effects/interaction.png");

    // animations 
    this.load.spritesheet('anim_axeswing', 'assets/effects/equipment/anim_axeswing.png', { frameWidth: 32, frameHeight: 32 });
}

function createAnimations(scene) {

    scene.anims.create({
        key: "anim_axeswing",
        frames: scene.anims.generateFrameNumbers("anim_axeswing", { frames: [0, 1, 2] }),
        frameRate: 3,
        repeat: 0
    });

}

function create() {

    createAnimations(this);

    this.socket = io();
    this.otherPlayers = this.add.group();

    this.inputKeys = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }
    playerInputCallbacks(this);

    // get all other players event, called on joining
    this.socket.on("otherPlayers", (players) => {
        for (var player in players) {
            // if this player
            if (player == this.socket.id) {
                addPlayer(this, players[player]);
            }
            // if other players
            else {
                addOtherPlayer(this, players[player]);
            }
        }
    });

    // get new player joining
    this.socket.on("otherPlayer", (player) => {
        addOtherPlayer(this, player)
    });

    // remove player leaving
    this.socket.on("removePlayer", (id) => {
        this.otherPlayers.getChildren().forEach((player) => {
            if (player.id == id) {
                logger.logi("player " + id + " removed");
                this.otherPlayers.remove(player, true);
            }
        });
    });

    // update state of other players
    this.socket.on("playerStateChanged", (playerState) => {
        this.otherPlayers.getChildren().forEach((player) => {
            if (player.id === playerState.id) {
                player.nextX = playerState.x;
                player.nextY = playerState.y;
            }
        });
    });

    // game objects
    clientObjects.createGroups(this);
    clientObjects.receiveFromServer(this);
    clientObjects.receiveFromClients(this);
}

function update() {
    playerInputUpdate(this);
    syncPlayerStateWithPlayerSprite(this.playerState, this.player);
    syncPlayerWithServer(this);
    interpolateOtherPlayerPositions(this);
    clientObjects.overlapMarkerInteractable(this);
}

function addPlayer(scene, playerState) {
    scene.playerState = playerState;
    scene.oldPlayerState = {};
    Object.assign(scene.oldPlayerState, playerState);

    scene.player = scene.physics.add.image(scene.playerState.x, scene.playerState.y, 'player');
    scene.player.setDrag(scene.playerState.drag);
    scene.player.setMaxVelocity(scene.playerState.speed);
}

function addOtherPlayer(scene, playerState) {
    const otherPlayer = scene.physics.add.image(playerState.x, playerState.y, 'player');
    otherPlayer.setDrag(100);
    otherPlayer.setMaxVelocity(200);
    otherPlayer.id = playerState.id;
    otherPlayer.nextX = playerState.x;
    otherPlayer.nextY = playerState.y;

    scene.otherPlayers.add(otherPlayer);
    logger.logi("other player added to scene");
}

function playerInputCallbacks(scene) {
    scene.input.on("pointerdown", (pointer) => {
        new Marker(scene, scene.socket, scene.socket.id, pointer.x, pointer.y, Marker.names["AxeBasic"]).sendToClients();
    });
}

function playerInputUpdate(scene) {
    if (scene.player) {
        // PLAYER MOVEMENT ====================================================================
        if (scene.inputKeys.down.isDown) {
            scene.player.setAccelerationY(scene.playerState.acceleration);
        }
        else if (scene.inputKeys.up.isDown) {
            scene.player.setAccelerationY(-scene.playerState.acceleration);
        }
        else {
            scene.player.setAccelerationY(0);
        }
        if (scene.inputKeys.left.isDown) {
            scene.player.setAccelerationX(-scene.playerState.acceleration);
        }
        else if (scene.inputKeys.right.isDown) {
            scene.player.setAccelerationX(scene.playerState.acceleration);
        }
        else {
            scene.player.setAccelerationX(0);
        }
        // ==================================================================== PLAYER MOVEMENT
    }
}

function syncPlayerStateWithPlayerSprite(playerState, player) {
    if (playerState && player) {
        playerState.x = player.x;
        playerState.y = player.y;
    }
}

function playerStateOutdated(scene) {
    if (scene.oldPlayerState && scene.playerState) {
        for (var property in scene.oldPlayerState) {
            if (scene.oldPlayerState[property] != scene.playerState[property]) {
                Object.assign(scene.oldPlayerState, scene.playerState);
                return true;
            }
        }
    }
    return false;
}

function syncPlayerWithServer(scene) {
    if (playerStateOutdated(scene)) {
        // update state with server
        scene.socket.emit("playerStateChanged", scene.playerState);
    }
}

function interpolateOtherPlayerPositions(scene) {
    scene.otherPlayers.getChildren().forEach((player) => {
        player.setPosition(lerpFloat(player.x, player.nextX, 0.2), lerpFloat(player.y, player.nextY, 0.2));
    });
}