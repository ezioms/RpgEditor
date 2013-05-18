THREE.Bot = function (app, dataBot) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	this.gravity = app.loader.my.gravity;
	this.fixe = dataBot.fixe;
	this.leak = dataBot.leak;
	this.radar = 200;
	this.speed = 0.5;
	this.speedMin = 0.5;
	this.speedMax = 2;


	var moveForward = true;
	var moveLeft = false;
	var moveRight = false;
	var jump = false;

	var lastAction = false;
	var isDie = false;
	var turn = false;

	var target = new THREE.Vector3(0, 0, 0);

	var timeSpeed = false;

	var currentdirection = {
		x: 0,
		jump: 0
	};

	var speedTmp = 0;

	//size
	var infoSize = app.loader.map.size;
	var sizeBloc = infoSize.elements;

	// les battle
	var battle = new THREE.Battle();

	var collision = new THREE.Collision(app);

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

	var action = function () {
		if (isDie)
			return;

		var rand = random(0, 100);

		// On fait tourner le bot aléatoirement
		turn = (rand > 90) ? true : false;

		//console.log('action', turn);

		setTimeout(action, 100);
	}


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

		currentdirection.jump = value;
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


	/*
	 * UPDATE
	 */
	this.update = function (app) {
		if (person.getDie()) {
			isDie = true;
			if (person.cycleDie == 500)
				return 'remove';
			if (person.name == 'bot')
				app.map.deleteOverModule(collision.getZone(this.position));
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

		var clone = this.clone();
		var rand = random(0, 100);

		// On vérifie que le bot se trouve dans la partie action du hero
		this.speed = this.speedMin;

		if (distance < this.radar) {
			timeSpeed = app.clock.elapsedTime + random(3, 10);
			if (!this.fixe)
				this.speed = this.speedMax;
		} else if (turn)
			if (app.clock.elapsedTime % 5 < 2.5)
				moveRight = true;
			else
				moveLeft = true;

		clone.position.y += currentdirection.jump -= this.gravity;

		if (moveForward) {
			speedTmp += 0.05;
			clone.position.x += Math.sin(currentdirection.x / 360 * PImulti2) * speedTmp;
			clone.position.z += Math.cos(currentdirection.x / 360 * PImulti2) * speedTmp;
		}


		var isMove = false;
		if (moveForward || moveLeft || moveRight)
			isMove = true;

		var resultCollision = collision.update(this, clone, this.gravity, currentdirection.jump, jump, isMove, speedTmp);
		jump = resultCollision.jump;
		speedTmp = resultCollision.speed;
		currentdirection.jump = resultCollision.currentJump;

		if (!moveForward)
			speedTmp = 0;
		else if (speedTmp > 2)
			speedTmp = 2;
		else if (speedTmp < 0)
			speedTmp = 0;


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

	this.position.set(dataBot.x, dataBot.y, dataBot.z);
	setTimeout(action, 500);
};

THREE.Bot.prototype = Object.create(THREE.Object3D.prototype);