//port utilisé
var port_websocket = 8585;

var io = require('socket.io');

var app = require('http').createServer();
io = io.listen(app); 

//io.set('log level', 1); // mettre en commentaire pour la dev

var users = {};
		
io.sockets.on('connection', function (socket) {
	
		socket.on('envois', function (mess) {
				users[socket.id] = mess;
				socket.broadcast.emit('message', mess);
		});
		
		socket.on('disconnect', function () {
				if( users[socket.id] != undefined ) {
						io.sockets.emit('disconnected', users[socket.id]);
						delete users[socket.id];
				}
		});
});

app.listen(port_websocket);