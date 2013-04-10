THREE.Bot = function (app, dataBot) {

	THREE.Object3D.call(this);

	this.target = new THREE.Vector3(0, 0, 0);

	this.zone = new THREE.Vector3(dataBot.x, dataBot.y, dataBot.z);

	this.moveForward = true;
	this.moveLeft = false;
	this.moveRight = false;

	this.wireframe = false;

	this.gravity = 1;
	this.heightJump = 13;
	this.jump = false;

	this.timeSpeed = false;
	this.lastTimeChange = 0;

	this.etat = 1;

	this.radar = 200;
	this.farViewBot = 2000;

	this.remove = false;

	this.lastAction = false;

	this.speed = 0.5;
	this.speedMin = 0.5;
	this.speedMax = 3;
	this.speedTmp = 0;
	this.currentdirection = {
		x: 0,
		y: 0
	};

	this.size = {
		elements: 0,
		xMax: 0,
		zMax: 0
	};

	this.size.xMax = app.loader.map.size.xMax;
	this.size.zMax = app.loader.map.size.zMax;


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

	var person = new THREE.Person('bot', dataBot.img, dataBot.name);
	person.name = 'bot';
	person.rotation.y = (270 * Math.PI / 180);

	this.fixe = dataBot.fixe;
	this.leak = dataBot.leak;


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

		if (this.position.distanceTo(app.hero.person.position) < 100) {
			var last = new Date().getTime();
			if (last - this.lastAction < 5000) {
				app.messages.push('...');
				return;
			}
			this.lastAction = last;

			app.messages.push(app.map.getArticles());
		}
	};


	/*
	 * UPDATE
	 */
	this.update = function (app) {
		var x = this.position.x;
		var z = this.position.z;
		var y = this.position.y;
		var rand = random(0, 100);
		
		var rayonSecurite = false;

		// On fait tourner le bot aléatoirement
		var turn = rand > 90 ? true : false;


		var hero = app.hero.getCamera().position;

		this.moveForward = true;

		this.moveRight = false;
		this.moveLeft = false;


		// Afficher le bot ou non selon sa distance avec le hero
		if (hero.x < x - this.farViewBot || hero.x > x + this.farViewBot
			|| hero.y < y - this.farViewBot || hero.y > y + this.farViewBot
			|| hero.z < z - this.farViewBot || hero.z > z + this.farViewBot) {
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

		// On vérifie que le bot se trouve dans la partie action du hero
		if (hero.x > x - this.radar && hero.x < x + this.radar && hero.y > y - this.radar && hero.y < y + this.radar && hero.z > z - this.radar && hero.z < z + this.radar) {
			this.timeSpeed = app.clock.elapsedTime + random(3, 10);
			rayonSecurite = true;
			turn = true;
		}

		this.speed = this.speedMin;

		if (this.leak && this.timeSpeed > app.clock.elapsedTime)
			this.speed = this.speedMax;


		//Calcul du déplacement
		if (this.moveForward) {
			this.speedTmp += 0.2;
			x += Math.sin(this.currentdirection.x / 360 * Math.PI * 2) * this.speedTmp;
			z += Math.cos(this.currentdirection.x / 360 * Math.PI * 2) * this.speedTmp;
		}
		else
			this.speedTmp = 0;

		if (this.speedTmp < 0)
			this.speedTmp = 0;
		else if (this.speedTmp > this.speed)
			this.speedTmp = this.speed;


		//Collision
		var wallX = (((x + (x > this.position.x ? 20 : -20)) + (maxX / 2)) / sizeBloc) + 1;
		var wallY = y / sizeBloc;
		var wallZ = ((z + (maxZ / 2)) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			x = this.position.x;
			this.speedTmp -= 0.2;
			turn = true;
		}

		wallX = ((x + (maxX / 2)) / sizeBloc) + 1;
		wallZ = (((z + (z > this.position.z ? 20 : -20)) + (maxZ / 2)) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ) || app.map.hasObstacle(wallX, wallY - 1, wallZ)) {
			z = this.position.z;
			this.speedTmp -= 0.2;
			turn = true;
		}

		if (x < -(maxX / 2) + middle) {
			x = -(maxX / 2) + middle;
			turn = true;
		} else if (x > maxX / 2 - middle) {
			x = maxX / 2 - middle;
			turn = true;
		}

		if (z < -(maxZ / 2) + middle) {
			z = -(maxZ / 2) + middle;
			turn = true;
		} else if (z > maxZ / 2 - middle) {
			z = maxZ / 2 - middle;
			turn = true;
		}

		if (!this.jump && turn) {
			if (app.clock.elapsedTime % 20 > 10)
				this.moveRight = true;
			else
				this.moveLeft = true;
		} else if (!this.jump && random(0, 50) > 90) {
			app.sound.play('system/016-Jump02.ogg', this.position);
			this.jump = true;
			this.currentdirection.y = this.heightJump;
		}

		y += this.currentdirection.y -= this.gravity;

		wallX = Math.floor((x + (maxX / 2)) / sizeBloc) + 1;
		wallY = Math.floor(y / sizeBloc);
		wallZ = Math.floor((z + (maxZ / 2)) / sizeBloc) + 1;

		if (app.map.hasObstacle(wallX, wallY, wallZ, app.hero.region) || app.map.hasObstacle(wallX, wallY - 1, wallZ, app.hero.region)) {
			y = Math.floor(this.position.y / sizeBloc) * sizeBloc;
			this.jump = false;
			this.currentdirection.y = 0;
		}

		if (y < 100)
			y = 100;

		//Look
		if (this.moveLeft)
			this.currentdirection.x += rand / 50;
		else if (this.moveRight)
			this.currentdirection.x -= rand / 50;

		var newRotation = (this.currentdirection.x + 270 % 360) * Math.PI / 180;

		person.position.set(this.position.x, this.position.y - 50, this.position.z);
		person.rotation.y = newRotation;

		if ((!this.leak && rayonSecurite) || this.fixe) {
			// Look Camera
			theta = Math.atan2(person.position.x - hero.x, person.position.z - hero.z);
			theta_deg = (theta / Math.PI * 180) + (theta > 0 ? 0 : 360);

			var direction = (theta_deg + 90) * (Math.PI / 180);

			if (direction != person.rotation.y)
				person.rotation.y = (theta_deg + 90) * (Math.PI / 180);

			if (buttonEnter)
				this.speack(app);

			person.initialGesture();
			person.stop();

			if (this.lastTimeChange < app.clock.elapsedTime) {
				if (!this.fixe)
					this.leak = random(0, 100) > dataBot.leak ? true : false;

				this.etat = random(3, 5);

				person.update(this.etat);

				this.lastTimeChange = app.clock.elapsedTime + random(5, 30);
			}
		}
		else {
			this.position.x = x;
			this.position.z = z;

			if (person.position.x != this.position.x || person.position.y != this.position.y - 50
				|| person.position.z != this.position.z || person.rotation.y != newRotation)
				person.update(this.speedTmp >= 2 ? 1 : 0);
		}

		this.position.y = y;

		this.zone.set(Math.floor((this.position.x + (maxX / 2)) / sizeBloc) + 1, Math.floor(this.position.y / sizeBloc) - 1, Math.floor((this.position.z + (maxZ / 2)) / sizeBloc) + 1);

		this.target.x = Math.round(x + (Math.sin(2 * Math.PI * (this.currentdirection.x / 360)) * this.far));
		this.target.z = Math.round(z + (Math.cos(2 * Math.PI * (this.currentdirection.x / 360)) * this.far));

		this.lookAt(this.target);
	};


	this.setPosition(this.zone.x, this.zone.y, this.zone.z);
};

THREE.Bot.prototype = Object.create(THREE.Object3D.prototype);