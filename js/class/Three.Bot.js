THREE.Bot = function (app, dataBot) {

	THREE.Object3D.call(this);

	this.zone = new THREE.Vector3(dataBot.x, dataBot.y, dataBot.z);

	this.wireframe = false;

	this.gravity = 1;
	this.fixe = dataBot.fixe;
	this.leak = dataBot.leak;
	this.radar = 200;
	this.farViewBot = 2000;
	this.speed = 0.5;
	this.speedMin = 0.5;
	this.speedMax = 3;

	var target = new THREE.Vector3(0, 0, 0);

	var timeSpeed = false;
	var lastTimeChange = 0;

	var lastAction = false;

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

	//tool
	var PI = Math.PI / 180;

	var person = new THREE.Person('bot', dataBot.img, dataBot.name);
	person.name = 'bot';
	person.rotation.y = (270 * PI);


	this.getPerson = function () {
		return person;
	}


	/*
	 *	SET position du héro
	 */
	this.setPosition = function (x, y, z) {
		this.zone.set(x, y, z);
		this.position.set(-middleMaxX + (x * sizeBloc + middle), y * sizeBloc + (sizeBloc * 2), -middleMaxZ + (z * sizeBloc + middle));
	};


	this.speack = function (app) {
		if (document.getElementById('notifications').innerHTML != '')
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

		var hero = app.hero.getCamera().position;

		// Afficher le bot ou non selon sa distance avec le hero
		if (hero.x < this.position.x - this.farViewBot || hero.x > this.position.x + this.farViewBot
			|| hero.y < this.position.y - this.farViewBot || hero.y > this.position.y + this.farViewBot
			|| hero.z < this.position.z - this.farViewBot || hero.z > this.position.z + this.farViewBot) {
			if (person.visible) {
				person.visible = false;
				person.traverse(function (child) {
					child.visible = false;
				});
				return;
			}
		} else if (!person.visible) {
			person.visible = true
			person.traverse(function (child) {
				child.visible = true;
			});
		}

		var rand = random(0, 100);

		var zoneHero = false;

		// On fait tourner le bot aléatoirement
		var turn = rand > 90 ? true : false;

		var clone = this.clone();

		var moveForward = true;
		var moveLeft = false;
		var moveRight = false;

		// On vérifie que le bot se trouve dans la partie action du hero
		if (hero.x > clone.position.x - this.radar && hero.x < clone.position.x + this.radar
			&& hero.y > clone.position.y - this.radar && hero.y < clone.position.y + this.radar
			&& hero.z > clone.position.z - this.radar && hero.z < clone.position.z + this.radar) {
			timeSpeed = app.clock.elapsedTime + random(3, 10);
			zoneHero = true;
			turn = false;
		}

		this.speed = this.speedMin;

		if (this.leak && timeSpeed > app.clock.elapsedTime)
			this.speed = this.speedMax;


		//Calcul du déplacement
		if (moveForward) {
			speedTmp += 0.2;
			clone.position.x += Math.sin(currentdirection.x / 360 * Math.PI * 2) * speedTmp;
			clone.position.z += Math.cos(currentdirection.x / 360 * Math.PI * 2) * speedTmp;
		}
		else
			speedTmp = 0;

		if (speedTmp < 0)
			speedTmp = 0;
		else if (speedTmp > this.speed)
			speedTmp = this.speed;


		//Collision
		var wallX = (((clone.position.x + (clone.position.x > this.position.x ? 20 : -20)) + middleMaxX) / sizeBloc) + 1;
		var wallY = clone.position.y / sizeBloc;
		var wallZ = ((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			clone.position.x = this.position.x;
			speedTmp -= 0.2;
			turn = true;
		}

		wallX = ((clone.position.x + middleMaxX) / sizeBloc) + 1;
		wallZ = (((clone.position.z + (clone.position.z > this.position.z ? 20 : -20)) + middleMaxZ) / sizeBloc) + 1;

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

		wallX = ((clone.position.x + middleMaxX) / sizeBloc) + 1;
		wallY = clone.position.y / sizeBloc;
		wallZ = ((clone.position.z + middleMaxZ) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			clone.position.y = this.position.y;
			currentdirection.y = 0;
		}

		if (clone.position.y < 100)
			clone.position.y = 100;

		//Look
		if (moveLeft)
			currentdirection.x += rand / 50;
		else if (moveRight)
			currentdirection.x -= rand / 50;

		var newRotation = (currentdirection.x + 270 % 360) * Math.PI / 180;

		person.position.set(this.position.x, this.position.y - 50, this.position.z);
		person.rotation.y = newRotation;

		if ((!this.leak && zoneHero) || this.fixe) {
			// Look Camera
			theta = Math.atan2(person.position.x - hero.x, person.position.z - hero.z);

			var direction = ((theta / Math.PI * 180) + (theta > 0 ? 0 : 360) + 90) * PI;

			if (direction != person.rotation.y)
				person.rotation.y = direction;

			if (buttonEnter)
				this.speack(app);

			person.initialGesture();
			person.stop();

			if (lastTimeChange < app.clock.elapsedTime) {
				if (!this.fixe)
					this.leak = random(0, 100) > dataBot.leak ? true : false;

				person.update(random(3, 5));

				lastTimeChange = app.clock.elapsedTime + random(5, 30);
			}
			this.position.set(this.position.x, clone.position.y, this.position.z);
		}
		else {
			this.position.set(clone.position.x, clone.position.y, clone.position.z);

			if (person.position.x != this.position.x || person.position.y != this.position.y - 50
				|| person.position.z != this.position.z || person.rotation.y != newRotation)
				person.update(speedTmp >= 2 ? 1 : 0);
		}

		this.zone.set(Math.floor((this.position.x + middleMaxX) / sizeBloc) + 1, Math.floor(this.position.y / sizeBloc) - 1, Math.floor((this.position.z + middleMaxZ) / sizeBloc) + 1);

		target.x = Math.round(this.position.x + (Math.sin(2 * Math.PI * (currentdirection.x / 360)) * this.far));
		target.z = Math.round(this.position.z + (Math.cos(2 * Math.PI * (currentdirection.x / 360)) * this.far));

		this.lookAt(target);
	};


	this.setPosition(this.zone.x, this.zone.y, this.zone.z);
};

THREE.Bot.prototype = Object.create(THREE.Object3D.prototype);