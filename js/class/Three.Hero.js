THREE.Hero = function (app) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	this.id = app.loader.my.id;
	this.username = app.loader.my.username;
	this.img = app.loader.my.img;
	this.region = app.loader.my.region;
	this.argent = app.loader.my.argent;
	this.xp = app.loader.my.xp;
	this.hp = app.loader.my.hp;
	this.hpMax = app.loader.my.hpMax;
	this.niveau = app.loader.my.niveau;
	this.gravity = app.loader.my.gravity;
	this.speed = app.loader.my.speed;
	this.zone = new THREE.Vector3(app.loader.my.x, app.loader.my.y, app.loader.my.z);
	this.currentdirection = {
		x: app.loader.datas.my.currentdirection_x,
		y: 0,
		jump: 0
	};

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var heightJump = 13;
	var jump = false;
	var run = false;

	var timeFall = 0;
	var speedTmp = 0;

	//size
	var infoSize = app.loader.map.size;
	var sizeBloc = infoSize.elements;
	var maxX = infoSize.xMax * sizeBloc;
	var maxZ = infoSize.zMax * sizeBloc;
	var middle = sizeBloc / 2;
	var middleMaxX = maxX / 2;
	var middleMaxZ = maxZ / 2;

	//tool
	var PI = 90 * Math.PI / 180;

	//camera
	var pitchObject = new THREE.Object3D();
	pitchObject.position.z = -2;
	pitchObject.add(app.camera);

	var yawObject = new THREE.Object3D();
	yawObject.add(pitchObject);
	yawObject.rotation.y = this.currentdirection.x;

	var person = new THREE.Person('hero', this.img);
	person.name = 'hero';
	person.rotation.y = PI + this.rotation.y;


	/*
	 *	GET camera du héro
	 */
	this.getCamera = function () {
		return yawObject;
	}

	/*
	 *	GET person du héro
	 */
	this.getPerson = function () {
		return person;
	}


	/*
	 *	SET position du héro
	 */
	this.setPosition = function (x, y, z) {
		this.zone.set(x, y, z);
		yawObject.position.set(-middleMaxX + (x * sizeBloc + middle), y * sizeBloc + (sizeBloc * 2), -middleMaxZ + (z * sizeBloc + middle));
	};


	/*
	 *	SET la rotation du héro
	 */
	this.setRotation = function (x, y) {
		this.currentdirection.x = x;
		this.currentdirection.y = y;
	};


	/*
	 * Position de la sourie
	 */
	this.onMouseMove = function (event) {
		// var global voir map.js
		if (!control)
			return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max(-1, Math.min(1, pitchObject.rotation.x));

		this.currentdirection.x = yawObject.rotation.y;

		event.preventDefault();
	};


	/*
	 * On relache le click sourie
	 */
	this.onMouseDown = function (event) {
		if (!control || jump)
			return;

		jump = true;
		this.currentdirection.jump = heightJump;

		app.sound.effect('system/016-Jump02.ogg', 0.2);

		event.preventDefault();
	};


	/*
	 * On appuie sur une touche du clavier
	 */
	this.onKeyDown = function (event) {

		if (event.keyCode != 13)
			document.getElementById('notifications').innerHTML = '';

		switch (event.keyCode) {
			case 38 :
			case 122 :
			case 119 :
			case 90 :
			case 87 : // Flèche haut, z, w, Z, W
				if (!moveForward)
					moveForward = true;
				break;
			case 37 :
			case 113 :
			case 97 :
			case 81 :
			case 65 : // Flèche gauche, q, a, Q, A
				if (!moveLeft)
					moveLeft = true;
				break;
			case 40 :
			case 115 :
			case 83 : // Flèche bas, s, S
				if (!moveBackward)
					moveBackward = true;
				break;
			case 39 :
			case 100 :
			case 68 : // Flèche droite, d, D
				if (!moveRight)
					moveRight = true;
				break;
			case 32:
				if (jump)
					break;

				jump = true;
				this.currentdirection.jump = heightJump;

				app.sound.effect('system/016-Jump02.ogg', 0.2);
				break;
			case 16 :
				run = true;
				break;
		}
	};


	/*
	 * On relache une touche du clavier
	 */
	this.onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38 :
			case 122 :
			case 119 :
			case 90 :
			case 87 : // Flèche haut, z, w, Z, W
				moveForward = false;
				break;
			case 37 :
			case 113 :
			case 97 :
			case 81 :
			case 65 : // Flèche gauche, q, a, Q, A
				moveLeft = false;
				break;
			case 40 :
			case 115 :
			case 83 : // Flèche bas, s, S
				moveBackward = false;
				break;
			case 39 :
			case 100 :
			case 68 : // Flèche droite, d, D
				moveRight = false;
				break;
			case 16 :
				run = false;
				break;
		}

		this.saveSession();
	};


	/*
	 * UPDATE du héro
	 */
	this.update = function (app) {

		var clone = yawObject.clone();

		if ((app.gamepad.buttonJump() || app.gamepad.buttonA()) && !jump) {
			jump = true;
			this.currentdirection.jump = heightJump;
			app.sound.effect('system/016-Jump02.ogg', 0.2);
		}

		if (moveLeft && !moveRight)
			clone.translateX(-this.speed);

		if (moveRight && !moveLeft)
			clone.translateX(this.speed);

		if (app.gamepad.axeXFoot() != 0)
			clone.translateX(-app.gamepad.axeXFoot());

		if (moveForward) {
			if (run)
				speedTmp += 0.2;
			clone.translateZ(-(this.speed + speedTmp));
		}
		else if (moveBackward)
			clone.translateZ(this.speed);
		else if (app.gamepad.axeZFoot() != 0) {
			speedTmp += app.gamepad.axeZFoot();
			clone.translateZ(-app.gamepad.axeZFoot());
		}


		if (!run && !app.gamepad.axeZFoot() && speedTmp > 0.2)
			speedTmp -= 0.2;


		if (!moveForward && !moveBackward)
			speedTmp = 0;
		else if (speedTmp > 2)
			speedTmp = 2;
		else if (speedTmp < 0)
			speedTmp = 0;

		clone.position.y += this.currentdirection.jump -= this.gravity;

		var dirYx = ((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var dirYy = clone.position.y / sizeBloc;
		var dirYz = ((clone.position.z + middleMaxZ) / sizeBloc) + 1;
		if (app.map.hasObstacle(dirYx, dirYy + 1, dirYz) || app.map.hasObstacle(dirYx, dirYy - 1, dirYz)) {
			clone.position.y = yawObject.position.y;
			jump = false;
			this.currentdirection.jump = 0;
		}

		if (clone.position.y < 100)
			clone.position.y = 100;

		var dirXx = (((clone.position.x + (clone.position.x > yawObject.position.x ? middle : -middle)) + middleMaxX) / sizeBloc) + 1;
		var dirXy = clone.position.y / sizeBloc;
		var dirXz = ((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(dirXx, dirXy, dirXz) || app.map.hasObstacle(dirXx, dirXy - 1, dirXz)) {
			clone.position.x = yawObject.position.x;
			speedTmp -= 0.2;
		}


		var dirZx = ((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var dirZy = clone.position.y / sizeBloc;
		var dirZz = (((clone.position.z + (clone.position.z > yawObject.position.z ? middle : -middle)) + middleMaxZ) / sizeBloc) + 1;
		if (app.map.hasObstacle(dirZx, dirZy) || app.map.hasObstacle(dirZx, dirZy - 1, dirZz)) {
			clone.position.z = yawObject.position.z;
			speedTmp -= 0.2;
		}


		if (clone.position.x < -middleMaxX + middle)
			clone.position.x = -middleMaxX + middle;
		else if (clone.position.x > middleMaxX - middle)
			clone.position.x = middleMaxX - middle;

		if (clone.position.z < -middleMaxZ + middle)
			clone.position.z = -middleMaxZ + middle;
		else if (clone.position.z > middleMaxZ - middle)
			clone.position.z = middleMaxZ - middle;

		if (yawObject.position.y != clone.position.y && yawObject.position.y > clone.position.y)
			timeFall += yawObject.position.y - clone.position.y;
		else
			timeFall = 0;

		if (person.position.x != clone.position.x || person.position.y != clone.position.y - 50 || person.position.z != clone.position.z || person.rotation.y != PI + yawObject.rotation.y) {
			person.update(speedTmp >= 2 || app.gamepad.axeZFoot() < -2 ? 1 : 0);
			app.sound.audioMove.volume = 0.1;
		}
		else
			app.sound.audioMove.volume = 0;

		var newZoneX = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var newZoneY = Math.floor(clone.position.y / sizeBloc) - 1;
		var newZoneZ = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		var noBot = false;

		if ((moveForward || moveBackward || app.gamepad.axeZFoot()) && !moveLeft && !moveRight && app.gamepad.axeXFoot() < 4 && app.gamepad.axeXFoot() > -4)
			for (key in app.scene.children)
				if (app.scene.children[key] instanceof THREE.Person && app.scene.children[key].name != 'hero') {
					var contactPerson = app.scene.children[key];
					var xPerson = Math.floor((contactPerson.position.x + middleMaxX) / sizeBloc) + 1;
					var yPerson = Math.floor(contactPerson.position.y / sizeBloc);
					var zPerson = Math.floor((contactPerson.position.z + middleMaxZ) / sizeBloc) + 1;

					if (xPerson === newZoneX && yPerson === newZoneY && zPerson === newZoneZ && !jump) {
						noBot = true;
						break;
					}

				}

		if (!noBot) {
			yawObject.position.set(clone.position.x, clone.position.y, clone.position.z);
			this.zone.set(newZoneX, newZoneY, newZoneZ);
			person.position.set(clone.position.x, clone.position.y - sizeBloc, clone.position.z);
			person.rotation.y = PI + yawObject.rotation.y;

			if (timeFall > 300 && yawObject.position.y == clone.position.y) {
				app.alert = timeFall * 10;
				app.messages.push('Chute de ' + (Math.round(timeFall) / 100) + 'm');
				app.hero.hp -= Math.round(Math.round(timeFall) / 10);
				timeFall = 0;
			}


			if (moveForward || moveBackward || moveLeft || moveRight)
				app.sound.move(true);
			else
				app.sound.move(false);
		}
		else
			app.sound.move(false);


		if (app.gamepad.axeXHead())
			this.currentdirection.x -= app.gamepad.axeXHead() * 2;

		if (app.gamepad.axeYHead())
			this.currentdirection.y -= app.gamepad.axeYHead() * 200;


		if (Date.now() % 60 == 0)
			if (this.hp < 100)
				this.hp++;


		if (this.hp <= 0) {
			this.setPosition(1, 1, 1)
			this.hp = 100;
			app.messages.push('GAME OVER');
		}
	};


	/*
	 * Sauvegarde de la session
	 */
	this.saveSession = function () {
		if (sessionStorage.currentdirection_x != this.currentdirection.x % 360)
			sessionStorage.currentdirection_x = this.currentdirection.x % 360;

		if (sessionStorage.currentdirection_y != this.currentdirection.y % 360)
			sessionStorage.currentdirection_y = this.currentdirection.y % 360;
	};


	/*
	 * Geneate GET for URL hero
	 */
	this.getData = function () {
		return 'region=' + this.region + '\
						&x=' + this.zone.x + '\
						&y=' + this.zone.y + '\
						&z=' + this.zone.z + '\
						&argent=' + this.argent + '\
						&xp=' + this.xp + '\
						&hp=' + this.hp + '\
						&hpMax=' + this.hpMax + '\
						&niveau=' + this.niveau + '\
						&gravity=' + this.gravity + '\
						&speed=' + this.speed + '\
						&currentdirection_x=' + this.currentdirection.x;
	};

	/*
	 * EVENT
	 */
	document.addEventListener('mousedown', bind(this, this.onMouseDown), false);
	document.addEventListener('mousemove', bind(this, this.onMouseMove), false);
	window.addEventListener('keydown', bind(this, this.onKeyDown), false);
	window.addEventListener('keyup', bind(this, this.onKeyUp), false);


	this.setPosition(this.zone.x, this.zone.y, this.zone.z);
};

THREE.Hero.prototype = Object.create(THREE.Object3D.prototype);