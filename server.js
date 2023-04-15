var logger = require('./server/logger.js').logger;
var exceptions = require('./server/exceptions.js').exceptions;
var players = require('./server/players.js').players;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

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
  });
});

server.listen(8080, function () {
  // console.log(`listening on ${server.address().port}`);
  logger.logi(`listening on ${server.address().port}`);
});

