THREE.Hero = function(app) {

		THREE.Object3D.call(this);

		var pitchObject = new THREE.Object3D();
		pitchObject.position.z = -2;
		pitchObject.add(app.camera);

		var yawObject = new THREE.Object3D();
		yawObject.add(pitchObject);


		this.target = new THREE.Vector3(0, 0, 0);
		this.targetClone = new THREE.Vector3(0, 0, 0);
		this.clone = new THREE.Object3D();
		this.zone = new THREE.Vector3(0, 0, 0);

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.timeFall = 0;

		this.wireframe = false;

		this.sizeElement = app.loader.map.size.elements;

		this.heightJump = 13;
		this.jump = false;
		this.run = false;

		this.speedTmp = 0;
		this.currentdirection = {
				x: app.loader.datas.my.currentdirection_x,
				y: 0,
				jump: 0
		};

		this.sizeElement = 0;

		this.region = app.loader.datas.my.region || 1;

		this.gravity = app.loader.datas.my.gravity || 1;
		this.speed = app.loader.datas.my.speed || 6;

		this.person = new THREE.Person(app.loader.datas.my.img);
		this.person.name = 'hero';
		this.person.rotation.y = (90 * Math.PI / 180) + this.rotation.y;
		
		
		
		this.getCamera = function() {
				return yawObject;
		}



		/*
		 * Geneate GET for URL hero
		 */
		this.getData = function() {
				var str = '';
				for (var key in app.loader.datas.my)
						if (key != 'img' && key != 'sorts')
								str += (key + '=' + app.loader.datas.my[key] + '&');
				str = str.slice(0, -1);

				return str;
		};


		/*
		 *	SET position du héro
		 */
		this.setPosition = function(x, y, z) {

				var infoSize = app.map.getSize(this.region);
				var sizeBloc = infoSize.elements;
				var maxX = infoSize.xMax * sizeBloc;
				var maxZ = infoSize.zMax * sizeBloc;

				this.zone.set(x, y, z);
				yawObject.position.x = -(maxX / 2) + (x * sizeBloc + (sizeBloc / 2));
				yawObject.position.y = y * sizeBloc + (sizeBloc * 2);
				yawObject.position.z = -(maxZ / 2) + (z * sizeBloc + (sizeBloc / 2));
		};



		/*
		 *	SET la rotation du héro
		 */
		this.setRotation = function(x, y) {
				this.currentdirection.x = x;
				this.currentdirection.y = y;
		};



		/*
		 * Position de la sourie
		 */
		this.onMouseMove = function(event) {
				// var global voir map.js
				if (!control)
						return;

				var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
				var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

				yawObject.rotation.y -= movementX * 0.002;
				pitchObject.rotation.x -= movementY * 0.002;

				pitchObject.rotation.x = Math.max(-1, Math.min(1, pitchObject.rotation.x));

		};



		/*
		 * On relache le click sourie
		 */
		this.onMouseDown = function(event) {
				if (!control || this.jump)
						return;

				this.jump = true;
				this.currentdirection.jump = this.heightJump;

				app.sound.effect('system/016-Jump02.ogg', 0.2);
		};



		/*
		 * On appuie le click sourie
		 */
		this.onMouseUp = function(event) {
		};



		/*
		 * On appuie sur une touche du clavier
		 */
		this.onKeyDown = function(event) {

				switch (event.keyCode) {
						case 38 :
						case 122 :
						case 119 :
						case 90 :
						case 87 : // Flèche haut, z, w, Z, W
								if (this.moveForward)
										break;

								app.sound.move(true);
								this.moveForward = true;
								break;
						case 37 :
						case 113 :
						case 97 :
						case 81 :
						case 65 : // Flèche gauche, q, a, Q, A
								if (this.moveLeft)
										break;

								app.sound.move(true);
								this.moveLeft = true;
								break;
						case 40 :
						case 115 :
						case 83 : // Flèche bas, s, S
								if (this.moveBackward)
										break;

								app.sound.move(true);
								this.moveBackward = true;
								break;
						case 39 :
						case 100 :
						case 68 : // Flèche droite, d, D
								if (this.moveRight)
										break;

								app.sound.move(true);
								this.moveRight = true;
								break;
						case 32:
								if (this.jump)
										break;

								this.jump = true;
								this.currentdirection.jump = this.heightJump;

								app.sound.effect('system/016-Jump02.ogg', 0.2);
								break;
						case 16 :
								this.run = true;
								break;
				}
		};



		/*
		 * On relache une touche du clavier
		 */
		this.onKeyUp = function(event) {
				switch (event.keyCode) {
						case 38 :
						case 122 :
						case 119 :
						case 90 :
						case 87 : // Flèche haut, z, w, Z, W
								app.sound.move(false);
								this.moveForward = false;
								break;
						case 37 :
						case 113 :
						case 97 :
						case 81 :
						case 65 : // Flèche gauche, q, a, Q, A
								app.sound.move(false);
								this.moveLeft = false;
								break;
						case 40 :
						case 115 :
						case 83 : // Flèche bas, s, S
								app.sound.move(false);
								this.moveBackward = false;
								break;
						case 39 :
						case 100 :
						case 68 : // Flèche droite, d, D
								app.sound.move(false);
								this.moveRight = false;
								break;
						case 16 :
								this.run = false;
								break;
				}

				this.saveSession();
		};



		/*
		 * UPDATE du héro
		 */
		this.update = function(app) {

				var infoSize = app.map.getSize(app.hero.region);
				var sizeBloc = infoSize.elements;
				var maxX = infoSize.xMax * sizeBloc;
				var maxZ = infoSize.zMax * sizeBloc;


				this.clone = yawObject.clone();

				if ((app.gamepad.buttonJump() || app.gamepad.buttonA()) && !this.jump) {
						this.jump = true;
						this.currentdirection.jump = this.heightJump;
						app.sound.effect('system/016-Jump02.ogg', 0.2);
				}

				if (this.moveLeft)
						this.clone.translateX(-(this.speed + this.speedTmp));
				else if (this.moveRight)
						this.clone.translateX(this.speed + this.speedTmp);
				else if (app.gamepad.axeXFoot() != 0)
						this.clone.translateX(-app.gamepad.axeXFoot());

				if (this.moveForward) {
						if (this.run)
								this.speedTmp += 0.2;
						this.clone.translateZ(-(this.speed + this.speedTmp));
				}
				else if (this.moveBackward)
						this.clone.translateZ(this.speed);
				else if (app.gamepad.axeZFoot() != 0) {
						this.speedTmp += app.gamepad.axeZFoot();
						this.clone.translateZ(-app.gamepad.axeZFoot());
				}



				if (!this.run && !app.gamepad.axeZFoot() && this.speedTmp > 0.2)
						this.speedTmp -= 0.2;



				if (!this.moveForward && !this.moveBackward)
						this.speedTmp = 0;
				else if (this.speedTmp > 2)
						this.speedTmp = 2;
				else if (this.speedTmp < 0)
						this.speedTmp = 0;


				var x = this.clone.position.x;
				var z = this.clone.position.z;
				var y = this.clone.position.y;

				y += this.currentdirection.jump -= this.gravity;

				var dirYx = Math.floor((x + (maxX / 2)) / sizeBloc) + 1;
				var dirYy = Math.floor(y / sizeBloc);
				var dirYz = Math.floor((z + (maxZ / 2)) / sizeBloc) + 1;
				if (app.map.hasObstacle(dirYx, dirYy + 1, dirYz, app.hero.region) || app.map.hasObstacle(dirYx, dirYy - 1, dirYz, app.hero.region)) {
						y = Math.floor(yawObject.position.y / sizeBloc) * sizeBloc;
						this.jump = false;
						this.currentdirection.jump = 0;
				}

				if (y < 100)
						y = 100;

				var middle = sizeBloc / 2;
				var dirXx = Math.floor(((x + (x > yawObject.position.x ? middle : -middle)) + (maxX / 2)) / sizeBloc) + 1;
				var dirXy = Math.floor(y / sizeBloc);
				var dirXz = Math.floor((z + (maxZ / 2)) / sizeBloc) + 1;
				if (app.map.hasObstacle(dirXx, dirXy, dirXz, app.hero.region) || app.map.hasObstacle(dirXx, dirXy - 1, dirXz, app.hero.region)) {
						x = yawObject.position.x;
						this.speedTmp -= 0.2;
				}


				var dirZx = Math.floor((x + (maxX / 2)) / sizeBloc) + 1;
				var dirZy = Math.floor(y / sizeBloc);
				var dirZz = Math.floor(((z + (z > yawObject.position.z ? middle : -middle)) + (maxZ / 2)) / sizeBloc) + 1;
				if (app.map.hasObstacle(dirZx, dirZy, dirZz, app.hero.region) || app.map.hasObstacle(dirZx, dirZy - 1, dirZz, app.hero.region)) {
						z = yawObject.position.z;
						this.speedTmp -= 0.2;
				}

				if (x < -(maxX / 2) + sizeBloc / 2)
						x = -(maxX / 2) + sizeBloc / 2;
				else if (x > maxX / 2 - (sizeBloc / 2))
						x = maxX / 2 - (sizeBloc / 2);

				if (z < -(maxZ / 2) + sizeBloc / 2)
						z = -(maxZ / 2) + sizeBloc / 2;
				else if (z > maxZ / 2 - (sizeBloc / 2))
						z = maxZ / 2 - (sizeBloc / 2);

				if (this.timeFall > 300 && yawObject.position.y == y) {
						app.alert = this.timeFall * 10;
						app.messages.push('Chute de ' + (Math.round(this.timeFall) / 100) + 'm');
						app.loader.datas.my.hp -= Math.round(Math.round(this.timeFall) / 10);
						this.timeFall = 0;
				}

				if (yawObject.position.y != y && yawObject.position.y > y)
						this.timeFall += yawObject.position.y - y;
				else
						this.timeFall = 0;

				if (this.person.position.x != x || this.person.position.y != y - 50 || this.person.position.z != z || this.person.rotation.y != (90 * Math.PI / 180) + yawObject.rotation.y) {
						this.person.update(this.speedTmp >= 2 || app.gamepad.axeZFoot() < -2 ? 1 : 0);
						app.sound.audioMove.volume = 0.1;
				}
				else
						app.sound.audioMove.volume = 0;

				var newZoneX = Math.floor((x + (maxX / 2)) / sizeBloc) + 1;
				var newZoneY = Math.floor(y / sizeBloc) - 1;
				var newZoneZ = Math.floor((z + (maxZ / 2)) / sizeBloc) + 1;

				var noBot = false;

				if ((this.moveForward || this.moveBackward || app.gamepad.axeZFoot()) && !this.moveLeft && !this.moveRight && app.gamepad.axeXFoot() < 4 && app.gamepad.axeXFoot() > -4)
						for (key in app.scene.children)
								if (app.scene.children[key] instanceof THREE.Person && app.scene.children[key].name != 'hero') {
										var contactPerson = app.scene.children[key];
										var xPerson = Math.floor((contactPerson.position.x + (maxX / 2)) / sizeBloc) + 1;
										var yPerson = Math.floor(contactPerson.position.y / sizeBloc);
										var zPerson = Math.floor((contactPerson.position.z + (maxZ / 2)) / sizeBloc) + 1;

										if (xPerson === newZoneX && yPerson === newZoneY && zPerson === newZoneZ) {
												noBot = true;
												break;
										}

								}

				if (!noBot) {
						yawObject.position.set(x, y, z);
						this.zone.set(newZoneX, newZoneY, newZoneZ);
						this.person.position.set(x, y - 50, z);
						this.person.rotation.y = (90 * Math.PI / 180) + yawObject.rotation.y;
				}


				if (app.gamepad.axeXHead())
						this.currentdirection.x -= app.gamepad.axeXHead() * 2;

				if (app.gamepad.axeYHead())
						this.currentdirection.y -= app.gamepad.axeYHead() * 200;
				
				

				this.save();
		};


		/*
		 * Sauvegarde de la session 
		 */
		this.save = function() {

				if (Date.now() % 60 == 0)
						if (app.loader.datas.my.hp < 100)
								app.loader.datas.my.hp++;

				app.loader.datas.my.x = this.zone.x;
				app.loader.datas.my.y = this.zone.y;
				app.loader.datas.my.z = this.zone.z;
				app.loader.datas.my.speed = this.speed;
				app.loader.datas.my.gravity = this.gravity;
				app.loader.datas.my.currentdirection_x = this.currentdirection.x % 360;
		};


		/*
		 * Sauvegarde de la session 
		 */
		this.saveSession = function() {
				if (sessionStorage.currentdirection_x != this.currentdirection.x % 360)
						sessionStorage.currentdirection_x = this.currentdirection.x % 360;
		};



		/*
		 * Delete session 
		 */
		this.deleteSession = function() {
				sessionStorage.removeItem('currentdirection_x');
		};

		/*
		 * EVENT 
		 */
		document.addEventListener('mouseup', bind(this, this.onMouseUp), false);
		document.addEventListener('mousedown', bind(this, this.onMouseDown), false);
		document.addEventListener('mousemove', bind(this, this.onMouseMove), false);
		window.addEventListener('keydown', bind(this, this.onKeyDown), false);
		window.addEventListener('keyup', bind(this, this.onKeyUp), false);


		this.setPosition(app.loader.datas.my.x, app.loader.datas.my.y, app.loader.datas.my.z);
};

THREE.Hero.prototype = Object.create(THREE.Object3D.prototype);