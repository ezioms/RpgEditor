THREE.Hero = function (app) {

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
	this.hand_left = app.loader.my.hand_left;
	this.hand_right = app.loader.my.hand_right;
	this.ammo = app.loader.my.ammo;
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

	var heightJump = 9;
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

	// memory stat hero
	var memoryBarValue = 0;
	var memoryScoreValue = 0;
	var memoryAmmoValue = 0;
	var memoryDistance = 0;

	var light = new THREE.PointLight(0xffaa00, 1.2, 400);

	// les battle
	var battle = new THREE.Battle();

	//camera
	var pitchObject = new THREE.Object3D();
	//pitchObject.position.z = 50;
	pitchObject.add(app.camera);

	var yawObject = new THREE.Object3D();
	yawObject.name = 'camera';
	yawObject.add(pitchObject);
	yawObject.rotation.y = this.currentdirection.x;

	yawObject.position.set(app.loader.my.positionX, app.loader.my.positionY, app.loader.my.positionZ);

	var person = new THREE.Person('hero', this.img, this.hand_left, this.hand_right);
	person.name = 'hero';
	person.rotation.y = PIDivise2;

	var shootgun = false;


	/*
	 *	GET camera du héro
	 */
	this.getCamera = function () {
		return yawObject;
	}


	/*
	 *	DELETE le nombre de munition
	 */
	this.deleteAmmo = function () {
		this.ammo--;
		if (this.ammo < 0)
			this.ammo = 0;

		return this.ammo;
	}

	/*
	 *	GET myRay
	 */
	this.getTorch = function () {
		return light;
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
		yawObject.position.set(-middleMaxX + (x * sizeBloc + middle), y * sizeBloc + sizeBloc, -middleMaxZ + (z * sizeBloc + middle));
	};


	/*
	 * Position de la sourie
	 */
	var INTERSECTED, raycaster;
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
	 * On appuis le click sourie
	 */
	this.onMouseDown = function (event) {
		// var global voir map.js
		if (!control)
			return;

		shootgun = 1;

		event.preventDefault();
	};


	/*
	 * On relache le click sourie
	 */
	this.onMouseUp = function (event) {

		shootgun = false;

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
					return;

				jump = true;
				this.currentdirection.jump = heightJump;

				app.sound.effect('jump.ogg', 0.2);
				break;
			case 76 :
				if (light.visible)
					light.visible = false;
				else
					light.visible = true;
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
				person.update(5);
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
				person.update(5);
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
	this.update = function (appNew) {

		app = appNew;
		var clone = yawObject.clone();

		if (moveLeft && !moveRight)
			clone.translateX(-this.speed);

		if (moveRight && !moveLeft)
			clone.translateX(this.speed);

		if (moveForward) {
			speedTmp += 0.05;
			clone.translateZ(-(this.speed + speedTmp));
		}
		else if (moveBackward)
			clone.translateZ(this.speed);


		if (!moveForward && !moveBackward)
			speedTmp = 0;
		else if (speedTmp > 2)
			speedTmp = 2;
		else if (speedTmp < 0)
			speedTmp = 0;


		clone.position.y += this.currentdirection.jump -= this.gravity;

		if (clone.position.y < sizeBloc) {
			clone.position.y = sizeBloc;
			this.currentdirection.jump = 0;
			jump = false;
		}

		//collision Y
		var dirYx = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var dirYyTop = Math.floor((clone.position.y + sizeBloc / 2) / sizeBloc);
		var dirYyBottom = Math.floor(clone.position.y / sizeBloc);
		var dirYz = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(dirYx, dirYyTop, dirYz) || app.map.hasObstacle(dirYx, dirYyBottom, dirYz)) {
			clone.position.y = yawObject.position.y;
			jump = false;
			this.currentdirection.jump = 0;
		}


		// collision X
		var dirXx = Math.floor(((clone.position.x + (clone.position.x > yawObject.position.x ? 10 : -10)) + middleMaxX) / sizeBloc) + 1;
		var dirXyTop = Math.floor((clone.position.y + sizeBloc / 2) / sizeBloc);
		var dirXyBottom = Math.floor(clone.position.y / sizeBloc);
		var dirXz = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(dirXx, dirXyTop, dirXz) || app.map.hasObstacle(dirXx, dirXyBottom, dirXz)) {
			clone.position.x = yawObject.position.x;
			speedTmp -= 0.05;
		}


		// collision Z
		var dirZx = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var dirZyTop = Math.floor((clone.position.y + sizeBloc / 2) / sizeBloc);
		var dirZyBottom = Math.floor(clone.position.y / sizeBloc);
		var dirZz = Math.floor(((clone.position.z + (clone.position.z > yawObject.position.z ? 10 : -10)) + middleMaxZ) / sizeBloc) + 1;
		if (app.map.hasObstacle(dirZx, dirZyTop, dirZz) || app.map.hasObstacle(dirZx, dirZyBottom, dirZz)) {
			clone.position.z = yawObject.position.z;
			speedTmp -= 0.05;
		}


		// no out map
		if (clone.position.x < -middleMaxX + middle)
			clone.position.x = -middleMaxX + middle;
		else if (clone.position.x > middleMaxX - middle)
			clone.position.x = middleMaxX - middle;

		if (clone.position.z < -middleMaxZ + middle)
			clone.position.z = -middleMaxZ + middle;
		else if (clone.position.z > middleMaxZ - middle)
			clone.position.z = middleMaxZ - middle;

		if (moveForward || moveBackward || moveLeft || moveRight)
			for (var key in app.scene.children)
				if (app.scene.children[key].name != 'hero'
					&& (app.scene.children[key] instanceof THREE.Bears
					|| app.scene.children[key] instanceof THREE.Dog
					|| app.scene.children[key] instanceof THREE.Person )) {
					var distance = app.scene.children[key].position.distanceTo(clone.position);
					if (distance < sizeBloc / 2 && memoryDistance > distance)
						clone.position = yawObject.position.clone();

					memoryDistance = distance;
				}


		if (yawObject.position.y != clone.position.y && yawObject.position.y > clone.position.y)
			timeFall += yawObject.position.y - clone.position.y;
		else if (timeFall > 150) {
			app.alert = timeFall * 10;
			app.messages.push('Chute de ' + (Math.round(timeFall) / 20) + 'm');
			app.hero.hp -= Math.round(Math.round(timeFall) / 10);
			timeFall = 0;
		}
		else
			timeFall = 0;

		if ((moveForward || moveBackward || moveLeft || moveRight) && !jump)
			app.sound.move(true);
		else
			app.sound.move(false);

		if (person.position.x != clone.position.x || person.position.y != clone.position.y - 50 || person.position.z != clone.position.z || person.rotation.y != PIDivise2 + yawObject.rotation.y) {
			person.update(( !moveForward && !moveBackward ? (shootgun ? 3 : 2) : (speedTmp >= 1 ? 1 : 0)));

			app.sound.audioMove.volume = 0.1;
		}
		else
			app.sound.audioMove.volume = 0;

		var newZoneX = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		var newZoneY = Math.floor(clone.position.y / sizeBloc) - 1;
		var newZoneZ = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;


		yawObject.position.set(clone.position.x, clone.position.y, clone.position.z);
		this.zone.set(newZoneX, newZoneY, newZoneZ);
		person.position.set(clone.position.x, clone.position.y - 16, clone.position.z);
		person.rotation.y = PIDivise2 + yawObject.rotation.y;

		var maxTorch = speedTmp >= 1 ? 50 : 10;

		if (app.clock.getDelta() * 1000 == 16)
			light.intensity = random(70, 100) / 100;

		light.position.set(yawObject.position.x + random(0, maxTorch), yawObject.position.y + 16, yawObject.position.z + random(0, maxTorch));

		/*
		 if (Date.now() % 60 == 0)
		 if (this.hp < 100)
		 this.hp++;
		 */


		if (this.hp <= 0) {
			this.setPosition(1, 1, 1)
			this.hp = 100;
			app.messages.push('GAME OVER');
		}
		else if (this.hp > 100)
			this.hp = 100;

		if (memoryBarValue != this.hp) {
			memoryBarValue = this.hp;
			valueGraph.innerHTML = this.hp;
			contentGraph.style.width = this.hp + '%';
		}

		if (memoryScoreValue != this.argent) {
			memoryScoreValue = this.argent;
			userScore.innerHTML = number_format(this.argent) + ' pt' + (this.argent > 1 ? 's' : '');
		}

		if (memoryAmmoValue != this.ammo) {
			memoryAmmoValue = this.ammo;
			userAmmo.innerHTML = number_format(this.ammo);
		}

		if (shootgun) {
			var now = Date.now();
			if (now - shootgun > 300) {
				battle.add(app);
				shootgun = now;

			}
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
						&positionX=' + yawObject.position.x + '\
						&positionY=' + yawObject.position.y + '\
						&positionZ=' + yawObject.position.z + '\
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
	document.addEventListener('mouseup', bind(this, this.onMouseUp), false);
	document.addEventListener('mousemove', bind(this, this.onMouseMove), false);
	window.addEventListener('keydown', bind(this, this.onKeyDown), false);
	window.addEventListener('keyup', bind(this, this.onKeyUp), false);
};