THREE.Person = function (type, picture, hand_left, hand_right) {

	THREE.Object3D.call(this);

	this.handLeft = new THREE.Object3D();

	this.handRight = new THREE.Object3D();

	this.wireframe = false;

	this.text = false;

	this.name = type;

	this.bodyGroup = new THREE.Object3D();

	var faceMesh = new THREE.MeshFaceMaterial();

	var listImg = {};


	/*
	 * Update person et position
	 */
	this.update = function (type) {
		this.initialGesture();

		switch (type) {
			case 1 :
				this.run();
				break;
			case 2 :
				this.stop();
				break;
			case 3 :
				this.shootgun();
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
		this.rightarm.rotation.set(0, 0, 0.5);
		this.leftarm.rotation.set(0, 0, 0.3);
		this.rightleg.rotation.set(0, 0, 0);
		this.leftleg.rotation.set(0, 0, 0);
	};


	/*
	 * Position person STOP
	 */
	this.stop = function () {
		this.rightarm.rotation.x = -0.2;
		this.leftarm.rotation.x = 0.2;

		this.rightleg.rotation.x = -0.1;
		this.leftleg.rotation.x = 0.1;
	};


	/*
	 * Position person STOP
	 */
	this.shootgun = function () {
		this.rightarm.rotation.z = 1.3;
		this.rightarm.rotation.x = -0.2;
	};


	/*
	 * Position person MARCHER
	 */
	this.walk = function () {
		var time = Date.now() / 1000;
		var speed = time * 4;

		var cosSpeed = Math.cos(speed);
		var sinSpeed = Math.sin(speed);

		this.head.rotation.y = this.headAccessory.rotation.y = Math.sin(time * 1.5) / 5;
		this.head.rotation.z = this.headAccessory.rotation.z = Math.sin(time) / 5;

		this.leftarm.rotation.z = -sinSpeed / 2;
		this.leftarm.rotation.x = (cosSpeed + PIDivise2) / 30;

		this.rightarm.rotation.z = sinSpeed / 2;
		this.rightarm.rotation.x = -(cosSpeed + PIDivise2) / 30;

		this.leftleg.rotation.z = sinSpeed / 3;
		this.rightleg.rotation.z = -sinSpeed / 3;
	};


	/*
	 * Position person RUN
	 */
	this.run = function () {
		var time = Date.now() / 1000;
		var z = 6.662 * time;
		var x = 2.812 * time;
		var cosX = Math.cos(x);
		var cosZ = Math.cos(z);

		this.head.rotation.y = this.headAccessory.rotation.y = Math.sin(time * 1.5) / 5;
		this.head.rotation.z = this.headAccessory.rotation.z = Math.sin(time) / 5;

		this.rightarm.rotation.z = 2 * Math.cos(z + PI);
		this.rightarm.rotation.x = 1 * (cosX - 1);

		this.leftarm.rotation.z = 2 * cosZ;
		this.leftarm.rotation.x = 1 * (cosX + 1);

		this.rightleg.rotation.z = 1.4 * cosZ;
		this.leftleg.rotation.z = 1.4 * Math.cos(z + PI);
	};


	/*
	 * Change item hand left
	 */
	this.changeLeft = function ( id ) {
		for ( var i = this.handLeft.children.length - 1; i >= 0 ; i -- )
			this.handLeft.remove(this.handLeft.children[ i ]);

		if(!id  || app.loader.items['item_'+id] == undefined || app.loader.items['item_'+id].image == undefined )
			return;

		this.handLeft.add(this.loadItem(-30, app.loader.items['item_'+id].image ));
		this.leftarm.add(this.handLeft);
	};


	/*
	 * Change item hand right
	 */
	this.changeRight = function ( id ) {
		for ( var i = this.handRight.children.length - 1; i >= 0 ; i -- )
			this.handRight.remove(this.handRight.children[ i ]);

		if(!id  || app.loader.items['item_'+id] == undefined || app.loader.items['item_'+id].image == undefined )
			return;

		this.handRight.add(this.loadItem(-45, app.loader.items['item_'+id].image ));

		console.log('arme')
		this.rightarm.add(this.handRight);
	};


	/*
	 * Load item for hands
	 */
	this.loadItem = function ( rotation, image ) {
		if(  typeof image =='string' ) {
			var path = dir_script+'images/items/'+image
			image = new Image();
			image.src = path;
		}

		var item = new THREE.Item( app, image );
		item.scale.x = 0.6;
		item.scale.y = 0.6;
		item.scale.z = 0.6;
		item.position.y = -10;
		item.position.z = -2;
		item.position.x = 2;
		item.rotation.z = rotation * Math.PI / 180 - 0.5;
		return item;
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

		return listImg[path] = new THREE.MeshLambertMaterial({
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
	this.headAccessory = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10, 0, 0, 0, this.materialHeadAccessory), faceMesh);
	this.headAccessory.position.x = -1;
	this.headAccessory.position.y = 18;

	//Head
	this.materialHead = [
		this.loadTexture(2, 2, 2, 2),
		this.loadTexture(2, 0, 2, 2),
		this.loadTexture(2, 0, 2, 2),
		this.loadTexture(4, 0, 2, 2),
		this.loadTexture(0, 2, 2, 2),
		this.loadTexture(4, 2, 2, 2)
	];
	this.head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8, 0, 0, 0, this.materialHead), faceMesh);
	this.head.position.y = 18;


	// Left / Right arm
	this.materialArm = [
		this.loadTexture(11, 4, 1, 4),
		this.loadTexture(11, 4, 1, 4),
		this.loadTexture(11, 4, 1, 1),
		this.loadTexture(12, 4, 1, 1),
		this.loadTexture(11, 4, 1, 4),
		this.loadTexture(11, 4, 1, 4)
	];


	var tarm = new THREE.CubeGeometry(4, 12, 4, 0, 0, 0, this.materialArm)
	for (i = 0; i < 8; i += 1)
		tarm.vertices[i].y -= 6;

	this.leftarm = new THREE.Mesh(tarm, faceMesh);
	this.rightarm = new THREE.Mesh(tarm, faceMesh);
	this.leftarm.position.z = -6;
	this.rightarm.position.z = 6;
	this.leftarm.position.y = 14;
	this.rightarm.position.y = 14;

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

	this.body = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 8, 0, 0, 0, this.materialBody), faceMesh);
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


	var leg = new THREE.CubeGeometry(4, 12, 4, 0, 0, 0, this.materialLeg)
	for (i = 0; i < 8; i += 1)
		leg.vertices[i].y -= 6;
	this.leftleg = new THREE.Mesh(leg, faceMesh);
	this.rightleg = new THREE.Mesh(leg, faceMesh);
	this.leftleg.position.z = -2;
	this.rightleg.position.z = 2;
	this.leftleg.position.y = 2;
	this.rightleg.position.y = 2;

	if(hand_right != undefined && hand_right )
		this.changeRight(hand_right);

	if(hand_left != undefined && hand_left )
		this.changeLeft(hand_left);

	this.bodyGroup.add(this.leftleg);
	this.bodyGroup.add(this.rightleg);

	this.add(this.bodyGroup);
	this.add(this.head);
	this.add(this.headAccessory);

	this.rotation.y = PIDivise2;

	this.scale.set(0.9, 0.9, 0.9);
};

THREE.Person.prototype = Object.create(THREE.Object3D.prototype);