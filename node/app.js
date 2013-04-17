var io = require('socket.io').listen(8585);

var client = {};

io.sockets.on('connection', function (socket) {

	// add user
	socket.on('addUser', function (user) {
		client[socket.id] = user;

		socket.emit('serverListUsers', client);

		io.sockets.emit('serverAddUser', client[socket.id]);
	});

	// update user
	socket.on('updateUser', function (user) {
		client[socket.id] = user;
		io.sockets.emit('serverUpdateUser', client[socket.id]);
	});

	// remove user
	socket.on('disconnect', function () {
		io.sockets.emit('serverRemoveUser', client[socket.id]);
		client[socket.id] = {};
		delete client[socket.id];
	});

});