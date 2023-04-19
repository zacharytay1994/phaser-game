var logger = require('./server/logger.js').logger;
var exceptions = require('./server/exceptions.js').exceptions;
var players = require('./server/players.js').players;
// var serverObjects = require("./server/gameobjects/server-object.js").serverObjects

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var world = require("./server/world.js").world;
exceptions.handle(() => {
  world.generate(io);
});

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  exceptions.handle(() => {

    logger.logi("player connected: " + socket.id);
    socket.on('disconnect', function () {
      logger.logi("player disconnected: " + socket.id);
      players.removePlayer(io, socket.id);
    });

    players.newPlayer(socket);

    world.sendToClient(socket);
    world.handleClientRequests(socket);
  });
});

server.listen(8080, function () {
  logger.logi(`listening on ${server.address().port}`);
});

