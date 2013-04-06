THREE.User = function ( dataUser, data, sound ) {

		THREE.Object3D.call( this );
		
		this.target = new THREE.Vector3( 0, 0, 0 );
		this.zone = new THREE.Vector3( dataUser.x, dataUser.y, dataUser.z );
		
		this.data = dataUser;

		this.person = new THREE.Person( dataUser.img, data, sound, dataUser.username);
		this.person.rotation.y = (270 * Math.PI / 180);
		
		

		/*
		 * UPDATE
		 */
		this.update = function( listUsers ) {	
				this.person.rightarm.rotation.set(listUsers.rightarmRotationXPerson,listUsers.rightarmRotationYPerson,listUsers.rightarmRotationZPerson);
				this.person.leftarm.rotation.set(listUsers.leftarmRotationXPerson,listUsers.leftarmRotationYPerson,listUsers.leftarmRotationZPerson);
				
				this.person.rightleg.rotation.set(listUsers.rightlegRotationXPerson,listUsers.rightlegRotationYPerson,listUsers.rightlegRotationZPerson);
				this.person.leftleg.rotation.set(listUsers.leftlegRotationXPerson,listUsers.leftlegRotationYPerson,listUsers.leftlegRotationZPerson);
				
				this.person.head.rotation.set(listUsers.headRotationXPerson,listUsers.headRotationYPerson,listUsers.headRotationZPerson);
				
				this.person.position.set(listUsers.xPerson,listUsers.yPerson,listUsers.zPerson);
				this.person.rotation.set(listUsers.xRotationPerson,listUsers.yRotationPerson,listUsers.zRotationPerson);
				
				this.zone = new THREE.Vector3( dataUser.x, dataUser.y, dataUser.z );
		};
};

THREE.User.prototype = Object.create( THREE.Object3D.prototype );