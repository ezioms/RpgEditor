THREE.Node = function( app ) {
		
		this.mySocket = false;
		
		this.recData = false;
		
		var listUsers = {};
		
		this.send = function( user )
		{
				if( this.mySocket == false)
						return;

				try {
						data = {
								type : 'user',
								id : user.id,
								argent : user.argent,
								img : user.img.src,
								hp : user.hp,
								niveau : user.niveau,
								region : user.region,
								username : user.username,
								xp : user.xp,
								x : user.zone.x,
								y : user.zone.y,
								z : user.zone.z,
								xPerson : user.person.position.x,
								yPerson : user.person.position.y,
								zPerson : user.person.position.z,
								xRotationPerson : user.person.rotation.x,
								yRotationPerson : user.person.rotation.y,
								zRotationPerson : user.person.rotation.z,
								rightarmRotationXPerson : user.person.rightarm.rotation.x,
								rightarmRotationYPerson : user.person.rightarm.rotation.y,
								rightarmRotationZPerson : user.person.rightarm.rotation.z,
								rightlegRotationXPerson : user.person.rightleg.rotation.x,
								rightlegRotationYPerson : user.person.rightleg.rotation.y,
								rightlegRotationZPerson : user.person.rightleg.rotation.z,
								leftarmRotationXPerson : user.person.leftarm.rotation.x,
								leftarmRotationYPerson : user.person.leftarm.rotation.y,
								leftarmRotationZPerson : user.person.leftarm.rotation.z,
								leftlegRotationXPerson : user.person.leftleg.rotation.x,
								leftlegRotationYPerson : user.person.leftleg.rotation.y,
								leftlegRotationZPerson : user.person.leftleg.rotation.z,
								headRotationXPerson : user.person.head.rotation.x,
								headRotationYPerson : user.person.head.rotation.y,
								headRotationZPerson : user.person.head.rotation.z
						};
						
						var dataJson = JSON.stringify(data);
						if( this.recData != dataJson ){
								this.recData = dataJson;
								this.mySocket.emit('envois', data);
						}

				} catch( ex ) {
						log('Erreur send_socket() : '+ex.toString());
				}
		};
		
		this.listUser = function() {
				return listUsers;
		};
		
		this.deleteUser = function( key ) {
				delete listUsers[key];
		};
		
		this.init = function() {
				try {
						this.mySocket = io.connect(url_websocket+':'+port_websocket);
				
						var socket = this.mySocket;
						socket.on('connect',function() {
								app.messages.push('Multi-joueur actif');
								socket.on('message', function(data) {
										switch(data.type)
										{
												case 'user' :
														data.img =  app.data.loadImage( data.img );
														listUsers[data.id] = data;
														break;
										}
								});
								socket.on('disconnected', function (data) {
										app.messages.push('Multi-joueur inactif');
										listUsers[data.id] = false;
								});
								socket.on('bot', function (data) {
										console.log(data);
								});
						});
						socket.on('error', function () {
								app.messages.push('Multi-joueur inactif');
						});
				} catch( ex ) {
						log('Erreur init_socket() : '+ex.toString());
				}
		};
}