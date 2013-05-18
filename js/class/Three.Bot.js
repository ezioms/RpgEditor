THREE.Bot = function (app, dataBot) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	this.gravity = 0.5;
	this.fixe = dataBot.fixe;
	this.leak = dataBot.leak;
	this.radar = 200;
	this.speed = 0.5;
	this.speedMin = 0.5;
	this.speedMax = 2;

	var lastAction = false;

	var target = new THREE.Vector3(0, 0, 0);

	var timeSpeed = false;

	var currentdirection = {
		x: 0,
		y: 0
	};

	var speedTmp = 0;

	//size
	var infoSize = app.loader.map.size;
	var sizeBloc = infoSize.elements;
	var maxX = infoSize.xMax * sizeBloc;
	var maxZ = infoSize.zMax * sizeBloc;

	// les battle
	var battle = new THREE.Battle();

	var person;

	if (dataBot.type == 2)
		person = new THREE.Bears(dataBot.img, this.id);
	else if (dataBot.type == 3)
		person = new THREE.Dog(dataBot.img, this.id);
	else {
		person = new THREE.Person('bot', dataBot.img, null, null, this.id);
		if (!this.fixe)
			person.changeRight(1);
	}

	person.name = 'bot';
	person.rotation.y = PIDivise2;


	this.getPerson = function () {
		return person;
	};

	this.getRay = function () {
		return person.ray;
	};

	this.setJump = function (value) {
		this.fixe = false;

		if (dataBot.type == 2)
			app.sound.play('touch_bears.ogg', person);
		else if (dataBot.type == 3)
			app.sound.play('touch_dog.ogg', person);
		else
			app.sound.play('touch.ogg', person);

		currentdirection.y = value;
	};


	this.speack = function (app) {
		if (notifications.innerHTML != '' || this.fixe)
			return;

		if (this.position.distanceTo(app.hero.getPerson().position) < 100) {
			var last = new Date().getTime();
			if (last - lastAction < 5000) {
				app.messages.push('...');
				return;
			}
			lastAction = last;

			app.messages.push(app.map.getArticles());
		}
	};


	this.getZone = function (position) {
		if (!position)
			position = this.position;
		return {
			x: Math.floor(position.x / sizeBloc),
			y: Math.floor((position.y - 25) / sizeBloc),
			yTop: Math.floor((position.y ) / sizeBloc),
			z: Math.floor(position.z / sizeBloc)
		};
	};


	/*
	 * UPDATE
	 */
	this.update = function (app) {

		if (person.getDie()) {
			if (person.cycleDie == 500)
				return 'remove';
			if (person.name == 'bot')
				app.map.deleteOverModule(this.getZone());
			return;

		}

		if (buttonEnter)
			this.speack(app);

		var hero = app.hero.getCamera().position;

		var distance = this.position.distanceTo(hero);

		// Afficher le bot ou non selon sa distance avec le hero
		if (distance > 1000) {
			if (person.visible) {
				person.visible = false;
				person.traverse(function (child) {
					child.visible = false;
				});
			}
			return;
		} else if (!person.visible) {
			person.visible = true;
			person.traverse(function (child) {
				child.visible = true;
			});
		}

		var rand = random(0, 100);

		// On fait tourner le bot aléatoirement
		var turn = (rand > 90) ? true : false;

		var moveForward = true;
		var moveLeft = false;
		var moveRight = false;

		var clone = this.clone();

		// On vérifie que le bot se trouve dans la partie action du hero
		this.speed = this.speedMin;

		if (distance < this.radar) {
			timeSpeed = app.clock.elapsedTime + random(3, 10);
			turn = false;
			if (!this.fixe)
				this.speed = this.speedMax;
		}


		//Calcul du déplacement
		if (moveForward) {
			speedTmp += 0.2;
			clone.position.x += Math.sin(currentdirection.x / 360 * PImulti2) * speedTmp;
			clone.position.z += Math.cos(currentdirection.x / 360 * PImulti2) * speedTmp;
		}
		else
			speedTmp = 0;

		if (speedTmp < 0)
			speedTmp = 0;
		else if (speedTmp > this.speed)
			speedTmp = this.speed;

		// collision X
		var collisionX = clone.position.clone();
		collisionX.x += clone.position.x > this.position.x ? 10 : -10;
		collisionX = this.getZone(collisionX);
		if (app.map.hasObstacle(collisionX.x, collisionX.yTop, collisionX.z) || app.map.hasObstacle(collisionX.x, collisionX.y, collisionX.z)) {
			clone.position.x = this.position.x;
			speedTmp -= 0.2;
			turn = true;
		}

		// collision Z
		var collisionZ = clone.position.clone();
		collisionZ.z += clone.position.z > this.position.z ? 10 : -10;
		collisionZ = this.getZone(collisionZ);
		if (app.map.hasObstacle(collisionZ.x, collisionZ.yTop, collisionZ.z) || app.map.hasObstacle(collisionZ.x, collisionZ.y, collisionZ.z)) {
			clone.position.z = this.position.z;
			speedTmp -= 0.2;
			turn = true;
		}

		if (clone.position.x < 0) {
			clone.position.x = 0;
			turn = true;
		} else if (clone.position.x > maxX) {
			clone.position.x = maxX;
			turn = true;
		}

		if (clone.position.z < 0) {
			clone.position.z = 0;
			turn = true;
		} else if (clone.position.z > maxZ) {
			clone.position.z = maxZ;
			turn = true;
		}


		clone.position.y += currentdirection.y -= this.gravity;

		//collision Y
		var collisionY = this.getZone(clone.position);
		if (app.map.hasObstacle(collisionY.x, collisionY.y, collisionY.z)) {
			clone.position.y = this.position.y;
			currentdirection.y = 0;
		}

		if (clone.position.y < 0)
			clone.position.y = 0;

		if (turn)
			if (app.clock.elapsedTime % 5 < 2.5)
				moveRight = true;
			else
				moveLeft = true;


		// On vérifie que le bot se trouve dans la partie action du hero
		if (distance < this.radar) {
			var theta = Math.atan2(person.position.x - hero.x, person.position.z - hero.z);

			currentdirection.x = ( ((theta / PI * 180) + (theta > 0 ? 0 : 360) + 90) * PIDivise180 ) / PIDivise180 + 90;

		} else if (moveLeft)
			currentdirection.x += rand / 50;
		else if (moveRight)
			currentdirection.x -= rand / 50;


		if (distance > sizeBloc + (sizeBloc / 2)) {
			if (this.fixe)
				this.position.set(this.position.x, clone.position.y, this.position.z);
			else
				this.position.copy(clone.position);

			if (person.position.x != this.position.x || person.position.y != this.position.y - 50 || person.position.z != this.position.z)
				person.update(speedTmp >= 2 ? 1 : this.fixe ? 2 : 0);
		} else
			person.update(2);


		// si c est un bot et a porté du hero on peut attaquer
		if (dataBot.type == 2 || dataBot.type == 3) {
			if (distance < sizeBloc + (sizeBloc / 2)) {
				if (app.clock.elapsedTime % 1 < 0.2)
					if (random(0, 5) < 1) {
						person.update(3);
						if (dataBot.type == 2)
							battle.addForAnimalBears(app, person.position.distanceTo(app.hero.getCamera().position));
						else if (dataBot.type == 3)
							battle.addForAnimalDog(app, person.position.distanceTo(app.hero.getCamera().position));
					}
			}
		} else if (!this.fixe && dataBot.type != 2 && dataBot.type != 3 && distance < this.radar) {
			if (app.clock.elapsedTime % 1 < 0.2)
				if (random(0, 5) < 1) {
					person.update(3);
					battle.addForBot(app, person.position.distanceTo(app.hero.getCamera().position), dataBot.fixe);
				}
		}

		person.position.copy(this.position);
		person.position.y -= 16;

		person.rotation.y = (currentdirection.x + 270 % 360) * PIDivise180;

		target.x = Math.round(this.position.x + (Math.sin(PImulti2 * (currentdirection.x / 360)) * this.far));
		target.z = Math.round(this.position.z + (Math.cos(PImulti2 * (currentdirection.x / 360)) * this.far));

		this.lookAt(target);
	};
	console.log(dataBot.x, dataBot.y, dataBot.z);
	this.position.set(dataBot.x, dataBot.y, dataBot.z);
};

THREE.Bot.prototype = Object.create(THREE.Object3D.prototype);