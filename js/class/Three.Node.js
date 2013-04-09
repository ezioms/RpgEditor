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
								xPerson : user.getPerson().position.x,
								yPerson : user.getPerson().position.y,
								zPerson : user.getPerson().position.z,
								xRotationPerson : user.getPerson().rotation.x,
								yRotationPerson : user.getPerson().rotation.y,
								zRotationPerson : user.getPerson().rotation.z,
								rightarmRotationXPerson : user.getPerson().rightarm.rotation.x,
								rightarmRotationYPerson : user.getPerson().rightarm.rotation.y,
								rightarmRotationZPerson : user.getPerson().rightarm.rotation.z,
								rightlegRotationXPerson : user.getPerson().rightleg.rotation.x,
								rightlegRotationYPerson : user.getPerson().rightleg.rotation.y,
								rightlegRotationZPerson : user.getPerson().rightleg.rotation.z,
								leftarmRotationXPerson : user.getPerson().leftarm.rotation.x,
								leftarmRotationYPerson : user.getPerson().leftarm.rotation.y,
								leftarmRotationZPerson : user.getPerson().leftarm.rotation.z,
								leftlegRotationXPerson : user.getPerson().leftleg.rotation.x,
								leftlegRotationYPerson : user.getPerson().leftleg.rotation.y,
								leftlegRotationZPerson : user.getPerson().leftleg.rotation.z,
								headRotationXPerson : user.getPerson().head.rotation.x,
								headRotationYPerson : user.getPerson().head.rotation.y,
								headRotationZPerson : user.getPerson().head.rotation.z
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