var memoryItemObj = {};

THREE.Item = function (app, img) {

	THREE.Object3D.call(this);

	this.size = 24;

	this.name = 'item';

	this.speedRotation = 0.02;

	this.visible = true;

	this.wireframe = false;

	var geometry = new THREE.Object3D();

	//size
	var infoSize = app.loader.map.size;
	var sizeBloc = infoSize.elements;
	var maxX = infoSize.xMax * sizeBloc;
	var maxY = infoSize.yMax * sizeBloc;
	var maxZ = infoSize.zMax * sizeBloc;
	var middle = sizeBloc / 2;
	var middleMaxX = maxX / 2;
	var middleMaxY = maxY / 2;
	var middleMaxZ = maxZ / 2;


	/*
	 * SET la position de l'item
	 */
	this.setPosition = function (x, y, z, no_calcul) {
		if (no_calcul) {
			this.position.set(x, y, z);
			return;
		}
		this.position.set(-middleMaxX + (x * sizeBloc - middle), y * sizeBloc + sizeBloc, -middleMaxZ + (z * sizeBloc - middle));
	};


	/*
	 * UPDATE
	 */
	this.update = function (app) {
		var visible = this.position.distanceTo(app.hero.getCamera().position) < 1000 ? true : false;

		if (this.visible != visible) {
			geometry.visible = visible;
			geometry.traverse(function (child) {
				child.visible = visible;
			});
			this.visible = visible;
		}

		if (!this.visible)
			return;

		geometry.rotation.y += this.speedRotation;
	};

//	img = 'obj/munition.js';
	/*
	 * Constructor item
	 */
	if (memoryItemObj[img] == undefined)
		app.JSONLoader.load('obj/' + img + '/json.js', function (vertices, materials) {
			var mesh = new THREE.Mesh(vertices, new THREE.MeshFaceMaterial(materials));
			memoryItemObj[img] = mesh;
			geometry.add(mesh);
		});
	else

		geometry.add(memoryItemObj[img]);


	this.add(geometry);
}

THREE.Item.prototype = Object.create(THREE.Object3D.prototype);