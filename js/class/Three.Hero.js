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
	var lastJump = 0;

	var timeFall = 0;
	var speedTmp = 0;

	var inWater = false;

	//size
	var infoSize = app.loader.map.size;
	var sizeBloc = infoSize.elements;
	var maxX = infoSize.xMax * sizeBloc;
	var maxY = infoSize.yMax * sizeBloc;
	var maxZ = infoSize.zMax * sizeBloc;
	var middle = sizeBloc / 2;

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
	yawObject.rotation.y = this.currentdirection.x;
	yawObject.position.set(app.loader.my.positionX, app.loader.my.positionY, app.loader.my.positionZ);
	yawObject.add(pitchObject);

	var clone = yawObject.clone();


	var person = new THREE.Person('hero', this.img, this.hand_left, this.hand_right);
	person.name = 'hero';
	person.rotation.y = PIDivise2;

	var shootgun = false;

	var spacerActive = false;


	/*
	 *	GET camera du héro
	 */
	this.getCamera = function () {
		return yawObject;
	};

	/*
	 *	GET myRay
	 */
	this.getTorch = function () {
		return light;
	};


	/*
	 *	GET person du héro
	 */
	this.getPerson = function () {
		return person;
	};


	/*
	 *	SET position du héro
	 */
	this.getZone = function (position) {
		if (!position)
			position = yawObject.position;

		return {
			x: Math.floor(position.x / sizeBloc),
			y: Math.floor((position.y - 25) / sizeBloc),
			yTop: Math.floor((position.y ) / sizeBloc),
			z: Math.floor(position.z / sizeBloc)
		};
	};


	/*
	 *	SET position du héro
	 */
	this.getZoneSmall = function (position) {
		if (!position)
			position = yawObject.position;

		return {
			x: Math.floor(position.x / (sizeBloc / 5)),
			y: Math.floor((position.y - 25) / (sizeBloc / 5)),
			yTop: Math.floor((position.y - 24) / (sizeBloc / 5)),
			z: Math.floor(position.z / (sizeBloc / 5))
		};
	};


	/*
	 *	DELETE le nombre de munition
	 */
	this.deleteAmmo = function () {
		this.ammo--;
		if (this.ammo < 0)
			this.ammo = 0;

		return this.ammo;
	};


	/*
	 * UPDATE du héro
	 */
	this.update = function (appNew) {

		app = appNew;
		clone = yawObject.clone();

		if (moveLeft && !moveRight)
			clone.translateX(-this.speed);

		if (moveRight && !moveLeft)
			clone.translateX(this.speed);

		if (moveForward && !moveBackward) {
			if (!inWater)
				speedTmp += 0.05;
			clone.translateZ(-(this.speed + speedTmp));
		}
		if (moveBackward && !moveForward)
			clone.translateZ(this.speed);

		//if in water
		if (inWater && pitchObject.rotation.x < 0.1 && pitchObject.rotation.x > -0.1)
			this.currentdirection.jump = 0;

		if (inWater && !spacerActive)
			clone.position.y += this.currentdirection.jump += (pitchObject.rotation.x / 100);
		else if (inWater && spacerActive)
			clone.position.y += this.currentdirection.jump -= 0.001;
		else
			clone.position.y += this.currentdirection.jump -= this.gravity;

		this.collision();

		// collision pnj
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


		// update coordonnée
		yawObject.position.copy(clone.position);
		person.position.copy(clone.position);
		person.rotation.y = PIDivise2 + yawObject.rotation.y;
		person.position.y -= 16;


		if (!moveForward && !moveBackward)
			speedTmp = 0;
		else if (speedTmp > 2)
			speedTmp = 2;
		else if (speedTmp < 0)
			speedTmp = 0;


		//calcul en cas de chute
		if (yawObject.position.y != clone.position.y && yawObject.position.y > clone.position.y && !inWater)
			timeFall += yawObject.position.y - clone.position.y;
		else if (timeFall > 150 && !inWater) {
			app.alert = timeFall * 10;
			app.messages.push('Chute de ' + (Math.round(timeFall) / 20) + 'm');
			app.hero.hp -= Math.round(Math.round(timeFall) / 10);
			timeFall = 0;
		}
		else
			timeFall = 0;


		//sound move
		if ((moveForward || moveBackward || moveLeft || moveRight) && !jump)
			app.sound.move(true, inWater);
		else
			app.sound.move(false, inWater);


		//update person
		if (person.position.x != clone.position.x || person.position.y != clone.position.y - 50 || person.position.z != clone.position.z || person.rotation.y != PIDivise2 + yawObject.rotation.y) {
			person.update(( !moveForward && !moveBackward ? 2 : (speedTmp || inWater >= 1 ? 1 : 0)), shootgun);

			app.sound.audioMove.volume = 0.2;
		}
		else
			app.sound.audioMove.volume = 0;


		//update de la torche
		var maxTorch = speedTmp >= 1 ? 50 : 10;

		if (app.clock.getDelta() * 1000 % 2 !== 0)
			light.intensity = random(80, 100) / 100;

		light.position.copy(yawObject.position);
		light.position.x += random(0, maxTorch);
		light.position.z += random(0, maxTorch);


		//data user
		if (this.hp <= 0)
			this.gameover();
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

		//shoot
		if (shootgun) {
			var now = Date.now();
			if (now - shootgun > 300) {
				battle.add(app);
				shootgun = now;

			}
		}

	};


	/*
	 COLLISION
	 */
	this.collision = function () {

		//collision Y
		var collisionY = this.getZone(clone.position);
		var collisionYFooter = app.map.hasObstacle(collisionY.x, collisionY.y, collisionY.z);
		if (app.map.hasObstacle(collisionY.x, collisionY.yTop, collisionY.z) || collisionYFooter) {
			clone.position.y = yawObject.position.y;
			if (collisionYFooter) {
				if (jump)
					app.sound.effect('jump2.ogg', 0.1);
				jump = false;
				this.currentdirection.jump = 0;
			}
			//console.log('collisionBigY');
		}

		// collision X
		var collisionX = clone.position.clone();
		collisionX.x += clone.position.x > yawObject.position.x ? 10 : -10;
		collisionX = this.getZone(collisionX);
		if (app.map.hasObstacle(collisionX.x, collisionX.yTop, collisionX.z) || app.map.hasObstacle(collisionX.x, collisionX.y, collisionX.z)) {
			clone.position.x = yawObject.position.x;
			speedTmp -= 0.05;
			//console.log('collisionBigX');
		}

		// collision Z
		var collisionZ = clone.position.clone();
		collisionZ.z += clone.position.z > yawObject.position.z ? 10 : -10;
		collisionZ = this.getZone(collisionZ);
		if (app.map.hasObstacle(collisionZ.x, collisionZ.yTop, collisionZ.z) || app.map.hasObstacle(collisionZ.x, collisionZ.y, collisionZ.z)) {
			clone.position.z = yawObject.position.z;
			speedTmp -= 0.05;
			//console.log('collisionBigZ');
		}

		var newZone = this.getZone();
		if (app.map.hasWater(newZone.x, newZone.y, newZone.x)) {
			water.style.display = 'block';
			light.visible = false;
			if (!inWater) {
				lastJump = Date.now();
				this.currentdirection.jump = 0;
			}
			inWater = true;

			person.water();
		} else {
			if (inWater && jump && this.currentdirection.jump > 0) {
				this.currentdirection.jump = heightJump - this.currentdirection.jump;
				jump = false;
			}
			inWater = false;
			water.style.display = 'none';
		}

		//collision GROUND
		if (clone.position.y < middle) {
			clone.position.y = middle;
			this.currentdirection.jump = 0;
			if (jump)
				app.sound.effect('jump2.ogg', 0.1);
			jump = false;
		} else if (clone.position.y > maxY - middle) {
			clone.position.y = maxY - middle;
			this.currentdirection.jump = 0;
			jump = false;
		}

		//Small elements
		var collisionXZ = false;

		// collision X
		var collisionX = clone.position.clone();
		collisionX.x += clone.position.x > yawObject.position.x ? 4 : -4;
		collisionX.y += this.gravity;
		collisionX = this.getZoneSmall(collisionX);
		var collisionXFooter = app.map.hasObstacleSmall(collisionX.x, collisionX.y, collisionX.z);
		var collisionXMedium = app.map.hasObstacleSmall(collisionX.x, collisionX.y + 1, collisionX.z);
		var collisionXTop = app.map.hasObstacleSmall(collisionX.x, collisionX.y + 2, collisionX.z);
		if (collisionXFooter || collisionXMedium || collisionXTop) {
			clone.position.x = yawObject.position.x;
			speedTmp -= 0.05;
			if (collisionXFooter && !collisionXMedium && !collisionXTop && ( moveForward || moveBackward || moveLeft || moveRight)) {
				this.currentdirection.jump = 3;
				collisionXZ = true;
			}
		}

		// collision Z
		var collisionZ = clone.position.clone();
		collisionZ.z += clone.position.z > yawObject.position.z ? 4 : -4;
		collisionZ.y += this.gravity;
		collisionZ = this.getZoneSmall(collisionZ);
		var collisionZFooter = app.map.hasObstacleSmall(collisionZ.x, collisionZ.y, collisionZ.z);
		var collisionZMeduim = app.map.hasObstacleSmall(collisionZ.x, collisionZ.y + 1, collisionZ.z);
		var collisionZTop = app.map.hasObstacleSmall(collisionZ.x, collisionZ.y + 2, collisionZ.z);
		if (collisionZFooter || collisionZMeduim || collisionZTop) {
			clone.position.z = yawObject.position.z;
			speedTmp -= 0.05;
			if (collisionZFooter && !collisionZMeduim && !collisionZTop && ( moveForward || moveBackward || moveLeft || moveRight)) {
				this.currentdirection.jump = 3;
				collisionXZ = true;
			}
			//console.log('collisionZ');
		}

		//collision Y
		var collisionY = this.getZoneSmall(clone.position);
		if (!collisionXZ && (app.map.hasObstacleSmall(collisionY.x, collisionY.y, collisionY.z)
			|| app.map.hasObstacleSmall(collisionY.x, collisionY.y + 1, collisionY.z)
			|| app.map.hasObstacleSmall(collisionY.x, collisionY.y + 2, collisionY.z))) {
			clone.position.y = yawObject.position.y;
			if (jump)
				app.sound.effect('jump2.ogg', 0.1);
			jump = false;
			this.currentdirection.jump = 0;
			//console.log('collisionY');
		}

		// no out map
		if (clone.position.x < 0)
			clone.position.x = 0;
		else if (clone.position.x > maxX )
			clone.position.x = maxX ;

		if (clone.position.z < 0)
			clone.position.z = 0;
		else if (clone.position.z > maxZ)
			clone.position.z = maxZ;
	};


	/*
	 * GAMEOVER
	 */
	this.gameover = function () {
		yawObject.rotation.set(0, -2.5, 0);
		yawObject.position.set(app.loader.my.positionX, app.loader.my.positionY, app.loader.my.positionZ);
		this.hp = 100;
		this.ammo = 32;
		this.currentdirection.x = 0;
		this.currentdirection.y = 0;

		app.messages.push('GAME OVER');
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
		var zone = this.getZone();
		return 'region=' + this.region + '\
						&x=' + (zone.x * sizeBloc + (sizeBloc / 2)) + '\
						&y=' + (zone.y * sizeBloc + (sizeBloc / 2)) + '\
						&z=' + (zone.z * sizeBloc + (sizeBloc / 2)) + '\
						&positionX=' + yawObject.position.x + '\
						&positionY=' + yawObject.position.y + '\
						&positionZ=' + yawObject.position.z + '\
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
	 * MOUSE
	 */


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

		pitchObject.rotation.x = Math.max((inWater ? -1.4 : -1), Math.min((inWater ? 1.4 : 1), pitchObject.rotation.x));

		this.currentdirection.x = yawObject.rotation.y;

		event.preventDefault();
	};


	/*
	 * On appuis le click sourie
	 */
	this.onMouseDown = function (event) {
		// var global voir map.js
		if (!control || inWater)
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
				spacerActive = true;
				if (jump && !inWater)
					return;

				var date = Date.now();
				if (lastJump > date - (inWater ? 300 : 500))
					return;

				lastJump = date;

				jump = true;
				this.currentdirection.jump = inWater ? 1 : heightJump;

				app.sound.effect((inWater ? 'jumpWater.ogg' : 'jump.ogg'), 0.1);
				break;
			case 76 :
				if (light.visible)
					light.visible = false;
				else if (!inWater)
					light.visible = true;
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
			case 32 :
				spacerActive = false;
				break;
		}

		this.saveSession();
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