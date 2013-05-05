THREE.Bot = function (app, dataBot) {

	THREE.Object3D.call(this);

	this.zone = new THREE.Vector3(dataBot.x, dataBot.y, dataBot.z);

	this.wireframe = false;

	this.gravity = 0.5;
	this.fixe = dataBot.fixe;
	this.leak = dataBot.leak;
	this.radar = 200;
	this.farViewBot = 2000;
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
	var middle = sizeBloc / 2;
	var middleMaxX = infoSize.xMax * sizeBloc / 2;
	var middleMaxZ = infoSize.zMax * sizeBloc / 2;

	var person;

	if (dataBot.type == 2)
		person = new THREE.Bears(dataBot.img, this.id);
	else if (dataBot.type == 3)
		person = new THREE.Dog(dataBot.img, this.id);
	else
		person = new THREE.Person('bot', dataBot.img, null, null, this.id);

	person.name = 'bot';
	person.rotation.y = PIDivise2;


	this.getPerson = function () {
		return person;
	};

	this.getRay = function () {
		return person.ray;
	};

	this.setJump = function (value) {
		currentdirection.y = value;
	};

	/*
	 *	SET position du héro
	 */
	this.setPosition = function (x, y, z) {
		this.zone.set(x, y, z);
		this.position.set(-middleMaxX + (x * sizeBloc + middle), y * sizeBloc + (sizeBloc * 2), -middleMaxZ + (z * sizeBloc + middle));
	};


	this.speack = function (app) {
		console.log('speack');
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


	/*
	 * UPDATE
	 */
	this.update = function (app) {

		if (person.getDie()) {
			if (person.name == 'bot')
				app.map.deleteOverModule(this.zone);
			return;

		}

		if (buttonEnter)
			this.speack(app);

		var hero = app.hero.getCamera().position;

		var distance = this.position.distanceTo(hero);

		// Afficher le bot ou non selon sa distance avec le hero
		if (distance > this.farViewBot) {
			if (person.visible) {
				person.visible = false;
				person.traverse(function (child) {
					child.visible = false;
				});
				return;
			}
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
		if (distance < this.radar) {
			timeSpeed = app.clock.elapsedTime + random(3, 10);
			turn = false;
		}

		this.speed = this.speedMin;

		if (this.leak && timeSpeed > app.clock.elapsedTime)
			this.speed = this.speedMax;


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


		//Collision
		var wallX = Math.floor(((clone.position.x + (clone.position.x > this.position.x ? middle : -middle)) + middleMaxX) / sizeBloc) + 1;
		var wallY = Math.floor(clone.position.y / sizeBloc);
		var wallZ = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			clone.position.x = this.position.x;
			speedTmp -= 0.2;
			turn = true;
		}

		wallX = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		wallZ = Math.floor(((clone.position.z + (clone.position.z > this.position.z ? middle : -middle)) + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			clone.position.z = this.position.z;
			speedTmp -= 0.2;
			turn = true;
		}

		if (clone.position.x < -middleMaxX + middle) {
			clone.position.x = -middleMaxX + middle;
			turn = true;
		} else if (clone.position.x > middleMaxX - middle) {
			clone.position.x = middleMaxX - middle;
			turn = true;
		}

		if (clone.position.z < -middleMaxZ + middle) {
			clone.position.z = -middleMaxZ + middle;
			turn = true;
		} else if (clone.position.z > middleMaxZ - middle) {
			clone.position.z = middleMaxZ - middle;
			turn = true;
		}

		if (turn)
			if (app.clock.elapsedTime % 20 > 10)
				moveRight = true;
			else
				moveLeft = true;

		clone.position.y += currentdirection.y -= this.gravity;

		wallX = Math.floor((clone.position.x + middleMaxX) / sizeBloc) + 1;
		wallY = Math.floor(clone.position.y / sizeBloc);
		wallZ = Math.floor((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			clone.position.y = this.position.y;
			currentdirection.y = 0;
		}

		if (clone.position.y < 100)
			clone.position.y = 100;


		// On vérifie que le bot se trouve dans la partie action du hero
		if (distance < this.radar) {
			var theta = Math.atan2(person.position.x - hero.x, person.position.z - hero.z);

			currentdirection.x = ( ((theta / PI * 180) + (theta > 0 ? 0 : 360) + 90) * PIDivise180 ) / PIDivise180 + 90;
		} else if (moveLeft)
			currentdirection.x += rand / 50;
		else if (moveRight)
			currentdirection.x -= rand / 50;

		for (var key in app.scene.children)
			if ((app.scene.children[key] instanceof THREE.Bears
				|| app.scene.children[key] instanceof THREE.Dog
				|| app.scene.children[key] instanceof THREE.Person ) && app.scene.children[key].position.distanceTo(clone.position) <= sizeBloc / 2) {
				distance = 0;
				clone.position = this.position.clone();
				break;
			}


		if (distance > sizeBloc + (sizeBloc / 2)) {
			if (this.fixe)
				this.position.set(this.position.x, clone.position.y, this.position.z);
			else
				this.position.set(clone.position.x, clone.position.y, clone.position.z);

			if (person.position.x != this.position.x || person.position.y != this.position.y - 50 || person.position.z != this.position.z)
				person.update(speedTmp >= 2 ? 1 : this.fixe ? 2 : 0);
		} else
			person.update(2);


		person.position.set(this.position.x, this.position.y - 68, this.position.z);

		person.rotation.y = (currentdirection.x + 270 % 360) * PIDivise180;


		this.zone.set(Math.floor((this.position.x + middleMaxX) / sizeBloc) + 1, Math.floor(this.position.y / sizeBloc) - 1, Math.floor((this.position.z + middleMaxZ) / sizeBloc) + 1);

		target.x = Math.round(this.position.x + (Math.sin(PImulti2 * (currentdirection.x / 360)) * this.far));
		target.z = Math.round(this.position.z + (Math.cos(PImulti2 * (currentdirection.x / 360)) * this.far));

		this.lookAt(target);
	};


	this.setPosition(this.zone.x, this.zone.y, this.zone.z);
};

THREE.Bot.prototype = Object.create(THREE.Object3D.prototype);