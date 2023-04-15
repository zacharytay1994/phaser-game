exports.players = (function () {

    var logger = require("./logger.js").logger;
    var players = {};

    return {
        // in the future player state can be saved/loaded using a database
        newPlayer: (socket) => {
            players[socket.id] = {
                id: socket.id,
                x: 400,
                y: 300,
                speed: 150,
                acceleration: 400,
                drag: 400
            };
            logger.logi("new player created with id: " + socket.id);

            // update new player with existing players
            socket.emit("otherPlayers", players);

            // update existing players with new player
            socket.broadcast.emit("otherPlayer", players[socket.id]);

            // player state update
            socket.on("playerStateChanged", (playerState) => {
                players[socket.id] = playerState;
                socket.broadcast.emit("playerStateChanged", players[socket.id]);
                // console.log("playerstate changed");
            });
        },
        removePlayer: (io, id) => {
            io.emit("removePlayer", id);
            delete players[id];
        }
    }
})();