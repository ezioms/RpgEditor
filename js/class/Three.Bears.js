THREE.Bears = function (picture, id) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	this.text = false;

	this.idBot = id;

	this.hp = random(5, 10);

	this.name = 'bears';

	this.bodyGroup = new THREE.Object3D();

	var faceMesh = new THREE.MeshFaceMaterial();

	var listImg = {};

	/*
	 * Get he's die
	 */
	this.getDie = function () {

		if (this.hp == 0) {
			this.hp--;
			this.die();
		}

		return this.hp < 0 ? true : false;
	}


	/*
	 * Update person et position
	 */
	this.update = function (type) {

		this.initialGesture();

		if (this.hp <= 0)
			return;

		switch (type) {
			case 1 :
				this.run();
				break;
			case 2 :
				this.stop();
				break;
			default :
				this.walk();
				break;
		}
	};


	/*
	 * Initialisation position person
	 */
	this.initialGesture = function () {
		this.rightarm.rotation.set(0, 0, 0);
		this.leftarm.rotation.set(0, 0, 0);
		this.rightleg.rotation.set(0, 0, 0);
		this.leftleg.rotation.set(0, 0, 0);
	};


	/*
	 * Position person STOP
	 */
	this.stop = function () {
		this.rightleg.rotation.x = this.leftarm.rotation.x = -0.1;
		this.leftleg.rotation.x = this.rightarm.rotation.x = 0.1;
	};


	/*
	 * Position person STOP
	 */
	this.die = function () {
		app.sound.effect('bears.mp3', 0.4);
		app.sound.effect('fall.mp3', 0.6);
		this.initialGesture();

		this.rightleg.rotation.x = this.rightarm.rotation.x = -1.3;
		this.leftleg.rotation.x = this.leftarm.rotation.x = 1.3;
		this.position.y -= 6;
	};


	/*
	 * Position person MARCHER
	 */
	this.walk = function () {
		var time = Date.now() / 1000;
		var speed = time * 4;

		var sinSpeed = Math.sin(speed);

		this.head.rotation.y = this.headAccessory.y = Math.sin(time * 1.5) / 5;
		this.head.rotation.z = this.headAccessory.z = Math.sin(time) / 5;

		this.leftleg.rotation.z = this.rightarm.rotation.z = sinSpeed / 3;
		this.rightleg.rotation.z = this.leftarm.rotation.z = -sinSpeed / 3;
	};


	/*
	 * Position person RUN
	 */
	this.run = function () {
		var time = Date.now() / 1000;
		var z = 6.662 * time;
		var x = 2.812 * time;
		var cosZ = Math.cos(z);

		this.head.rotation.y = this.headAccessory.y = Math.sin(time * 1.5) / 5;
		this.head.rotation.z = this.headAccessory.z = Math.sin(time) / 5;

		this.rightleg.rotation.z = this.leftarm.rotation.z = 1.4 * cosZ;
		this.leftleg.rotation.z = this.rightarm.rotation.z = 1.4 * Math.cos(z + PI);
	};


	/*
	 * Load texture
	 */
	this.loadTexture = function (x, y, xSize, ySize) {

		var ratio = picture.width / 16;

		x *= ratio;
		y *= ratio;
		xSize *= ratio;
		ySize *= ratio;

		var path = x + '-' + y + '-' + xSize + '-' + ySize;

		if (listImg[path] !== undefined)
			return listImg[path];

		var canvas = window.document.createElement('canvas');
		canvas.width = xSize;
		canvas.height = ySize;

		var context = canvas.getContext('2d');

		context.drawImage(picture, x, y, xSize, ySize, 0, 0, xSize, ySize);

		var texture = new THREE.Texture(canvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
		texture.needsUpdate = true;

		return listImg[path] = new THREE.MeshPhongMaterial({
			map: texture,
			wireframe: this.wireframe,
			transparent: true
		});
	};


	/*
	 * Contructor person
	 */
	var i = 0;

	//Head
	this.materialHeadAccessory = [
		this.loadTexture(10, 2, 2, 2),
		this.loadTexture(10, 0, 2, 2),
		this.loadTexture(10, 0, 2, 2),
		this.loadTexture(12, 0, 2, 2),
		this.loadTexture(8, 2, 2, 2),
		this.loadTexture(12, 2, 2, 2)
	];
	this.headAccessory = new THREE.Mesh(new THREE.CubeGeometry(11, 11, 11, 0, 0, 0, this.materialHeadAccessory), faceMesh);
	this.headAccessory.position.x = 12;
	this.headAccessory.position.y = 12;


	//Head
	this.materialHead = [
		this.loadTexture(2, 2, 2, 2),
		this.loadTexture(2, 0, 2, 2),
		this.loadTexture(2, 0, 2, 2),
		this.loadTexture(4, 0, 2, 2),
		this.loadTexture(0, 2, 2, 2),
		this.loadTexture(4, 2, 2, 2)
	];
	this.head = new THREE.Mesh(new THREE.CubeGeometry(9, 9, 9, 0, 0, 0, this.materialHead), faceMesh);
	this.head.position.x = 12;
	this.head.position.y = 12;


	// Left / Right leg
	this.materialArm = [
		this.loadTexture(0, 5, 1, 3),
		this.loadTexture(2, 5, 1, 3),
		this.loadTexture(1, 4, 1, 1),
		this.loadTexture(2, 4, 1, 1),
		this.loadTexture(3, 5, 1, 3),
		this.loadTexture(1, 5, 1, 3)
	];


	var arm = new THREE.CubeGeometry(6, 16, 6, 0, 0, 0, this.materialArm)
	for (i = 0; i < 8; i += 1)
		arm.vertices[i].y -= 6;
	this.leftarm = new THREE.Mesh(arm, faceMesh);
	this.rightarm = new THREE.Mesh(arm, faceMesh);
	this.leftarm.position.z = -8;
	this.leftarm.position.x = 8;
	this.rightarm.position.z = 8;
	this.rightarm.position.x = 8;
	this.leftarm.position.y = 6;
	this.rightarm.position.y = 6;

	this.bodyGroup.add(this.leftarm);
	this.bodyGroup.add(this.rightarm);


	// Body
	this.materialBody = [
		this.loadTexture(5, 5, 2, 3),
		this.loadTexture(8, 5, 2, 3),
		this.loadTexture(5, 4, 2, 1),
		this.loadTexture(7, 4, 2, 1),
		this.loadTexture(4, 5, 1, 3),
		this.loadTexture(7, 5, 1, 3)
	];

	this.body = new THREE.Mesh(new THREE.CubeGeometry(24, 12, 18, 0, 0, 0, this.materialBody), faceMesh);
	this.body.position.y = 8;
	this.bodyGroup.add(this.body);


	// Left / Right leg
	this.materialLeg = [
		this.loadTexture(0, 5, 1, 3),
		this.loadTexture(2, 5, 1, 3),
		this.loadTexture(1, 4, 1, 1),
		this.loadTexture(2, 4, 1, 1),
		this.loadTexture(3, 5, 1, 3),
		this.loadTexture(1, 5, 1, 3)
	];


	var leg = new THREE.CubeGeometry(6, 16, 6, 0, 0, 0, this.materialLeg)
	for (i = 0; i < 8; i += 1)
		leg.vertices[i].y -= 6;
	this.leftleg = new THREE.Mesh(leg, faceMesh);
	this.rightleg = new THREE.Mesh(leg, faceMesh);
	this.leftleg.position.z = -8;
	this.leftleg.position.x = -8;
	this.rightleg.position.z = 8;
	this.rightleg.position.x = -8;
	this.leftleg.position.y = 6;
	this.rightleg.position.y = 6;

	this.bodyGroup.add(this.leftleg);
	this.bodyGroup.add(this.rightleg);

	this.ray = new THREE.Mesh(new THREE.CubeGeometry(26, 20, 24));
	this.ray.visible = false;
	this.ray.position.y = 8;
	this.ray.name = 'rayBear';

	this.add(this.bodyGroup);
	this.add(this.head);
	this.add(this.headAccessory);
	this.add(this.ray);


	this.rotation.y = PIDivise2;

	this.scale.set(1.2, 1.2, 1.2);
};

THREE.Bears.prototype = Object.create(THREE.Object3D.prototype);