THREE.Node = function( app ) {
		
		this.mySocket = false;
		
		this.recData = false;
		
		var listUsers = {};
		
		this.send = function( datas, personDatas )
		{
				if( this.mySocket == false)
						return;

				try {
						data = {
								type : 'user',
								id : datas.id,
								argent : datas.argent,
								img : datas.img.src,
								attack : datas.attack,
								defense : datas.defense,
								hand_left : datas.hand_left,
								hand_right : datas.hand_right,
								hp : datas.hp,
								mp : datas.mp,
								niveau : datas.niveau,
								region : datas.region,
								username : datas.username,
								xp : datas.xp,
								x : datas.x,
								y : datas.y,
								z : datas.z,
								xPerson : personDatas.position.x,
								yPerson : personDatas.position.y,
								zPerson : personDatas.position.z,
								xRotationPerson : personDatas.rotation.x,
								yRotationPerson : personDatas.rotation.y,
								zRotationPerson : personDatas.rotation.z,
								rightarmRotationXPerson : personDatas.rightarm.rotation.x,
								rightarmRotationYPerson : personDatas.rightarm.rotation.y,
								rightarmRotationZPerson : personDatas.rightarm.rotation.z,
								rightlegRotationXPerson : personDatas.rightleg.rotation.x,
								rightlegRotationYPerson : personDatas.rightleg.rotation.y,
								rightlegRotationZPerson : personDatas.rightleg.rotation.z,
								leftarmRotationXPerson : personDatas.leftarm.rotation.x,
								leftarmRotationYPerson : personDatas.leftarm.rotation.y,
								leftarmRotationZPerson : personDatas.leftarm.rotation.z,
								leftlegRotationXPerson : personDatas.leftleg.rotation.x,
								leftlegRotationYPerson : personDatas.leftleg.rotation.y,
								leftlegRotationZPerson : personDatas.leftleg.rotation.z,
								headRotationXPerson : personDatas.head.rotation.x,
								headRotationYPerson : personDatas.head.rotation.y,
								headRotationZPerson : personDatas.head.rotation.z
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