class ClientPlayers {
    constructor(scene) {
        this.scene = scene;
        this.socket = scene.socket;
        this.player = null;
        this.otherPlayers = scene.add.group();

        this.inputKeys = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        this.playerInputCallbacks();

        // get all other players event, called on joining
        var self = this;
        this.socket.on("otherPlayers", (players) => {
            for (var player in players) {
                // if this player
                if (player == self.socket.id) {
                    self.addPlayer(players[player]);
                }
                // if other players
                else {
                    self.addOtherPlayer(players[player]);
                }
            }
        });

        // get new player joining
        this.socket.on("otherPlayer", (player) => {
            self.addOtherPlayer(player)
        });

        // remove player leaving
        this.socket.on("removePlayer", (id) => {
            self.otherPlayers.getChildren().forEach((player) => {
                if (player.id == id) {
                    logger.logi("player " + id + " removed");
                    self.otherPlayers.remove(player, true);
                }
            });
        });

        // update state of other players
        this.socket.on("playerStateChanged", (playerState) => {
            self.otherPlayers.getChildren().forEach((player) => {
                if (player.id === playerState.id) {
                    player.nextX = playerState.x;
                    player.nextY = playerState.y;
                }
            });
        });
    }

    update() {
        this.playerInputUpdate();
        this.syncPlayerStateWithPlayerSprite();
        this.syncPlayerWithServer();
        this.interpolateOtherPlayerPositions();
    }

    receiveFromServer() {
        this.socket.on("otherPlayers", (players) => {
            for (var player in players) {
                // if this player
                if (player == this.socket.id) {
                    this.addPlayer(players[player]);
                }
                // if other players
                else {
                    this.addOtherPlayer(players[player]);
                }
            }
        });
    }

    addPlayer(playerState) {
        this.playerState = playerState;
        this.oldPlayerState = {};
        Object.assign(this.oldPlayerState, playerState);
        this.player = this.scene.physics.add.image(playerState.x, playerState.y, 'player');
        this.player.setDrag(playerState.drag);
        this.player.setMaxVelocity(playerState.speed);
    }

    addOtherPlayer(playerState) {
        const otherPlayer = this.scene.physics.add.image(playerState.x, playerState.y, 'player');
        otherPlayer.setDrag(100);
        otherPlayer.setMaxVelocity(200);
        otherPlayer.id = playerState.id;
        otherPlayer.nextX = playerState.x;
        otherPlayer.nextY = playerState.y;

        this.otherPlayers.add(otherPlayer);
        logger.logi("other player added to scene");
    }

    playerInputCallbacks() {
        var scene = this.scene;
        scene.input.on("pointerdown", (pointer) => {
            new Marker(scene, scene.socket, scene.socket.id, pointer.x, pointer.y, Marker.names["AxeBasic"]).sendToClients();
        });
    }

    playerInputUpdate() {
        if (this.player) {
            // PLAYER MOVEMENT ====================================================================
            if (this.inputKeys.down.isDown) {
                this.player.setAccelerationY(this.playerState.acceleration);
            }
            else if (this.inputKeys.up.isDown) {
                this.player.setAccelerationY(-this.playerState.acceleration);
            }
            else {
                this.player.setAccelerationY(0);
            }
            if (this.inputKeys.left.isDown) {
                this.player.setAccelerationX(-this.playerState.acceleration);
            }
            else if (this.inputKeys.right.isDown) {
                this.player.setAccelerationX(this.playerState.acceleration);
            }
            else {
                this.player.setAccelerationX(0);
            }
            // ==================================================================== PLAYER MOVEMENT
        }
    }

    syncPlayerStateWithPlayerSprite() {
        if (this.playerState && this.player) {
            this.playerState.x = this.player.x;
            this.playerState.y = this.player.y;
        }
    }

    playerStateOutdated() {
        if (this.oldPlayerState && this.playerState) {
            for (var property in this.oldPlayerState) {
                if (this.oldPlayerState[property] != this.playerState[property]) {
                    Object.assign(this.oldPlayerState, this.playerState);
                    return true;
                }
            }
        }
        return false;
    }

    syncPlayerWithServer() {
        if (this.playerStateOutdated()) {
            // update state with server
            this.socket.emit("playerStateChanged", this.playerState);
        }
    }

    interpolateOtherPlayerPositions() {
        this.otherPlayers.getChildren().forEach((player) => {
            player.setPosition(lerpFloat(player.x, player.nextX, 0.2), lerpFloat(player.y, player.nextY, 0.2));
        });
    }
}