function preload() {
    this.load.image('player', 'assets/player.png');
}

function create() {
    this.socket = io();
    this.otherPlayers = this.add.group();

    this.inputKeys = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }

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
                player.setPosition(playerState.x, playerState.y);
            }
        });
    });

    // input handling
    this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
    handleInput(this);
    syncPlayerStateWithPlayerSprite(this.playerState, this.player);
    syncPlayerWithServer(this);
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

    scene.otherPlayers.add(otherPlayer);
    logger.logi("other player added to scene");
}

function handleInput(scene) {
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
        // console.log(scene.oldPlayerState);
        // console.log(scene.playerState);
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