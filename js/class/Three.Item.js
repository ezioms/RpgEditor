THREE.Item = function (app, img) {

	THREE.Object3D.call(this);

	this.geometry = new THREE.Object3D();

	this.size = 24;

	this.dept = 1;

	this.speedRotation = 0.02;

	this.visible = false;

	this.wireframe = false;

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
		this.position.set(-middleMaxX + (x * sizeBloc + middle), y * sizeBloc + sizeBloc, -middleMaxZ + (z * sizeBloc + middle));
	};


	/*
	 * UPDATE
	 */
	this.update = function () {
		this.geometry.rotation.y += this.speedRotation;
	};


	/*
	 * Chargement de la matiere
	 */
	this.material = function (canvas) {
		var material = new THREE.MeshLambertMaterial({
			map: new THREE.Texture(canvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter),
			wireframe: this.wireframe,
			transparent: true
		});
		material.map.needsUpdate = true;

		return material;
	};


	/*
	 * Constructor item
	 */
	var canvas = window.document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.width = this.size;
	canvas.height = this.size;

	context.drawImage(img, 0, 0, this.size, this.size);

	// épaisseur de l'item
	var cubes = new THREE.CubeGeometry(1, 1, 1);

	var memoryColor = {};

	function componentFromStr(numStr, percent) {
		var num = Math.max(0, parseInt(numStr, 10));
		return percent ?
			Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
	}

	function rgbToHex(rgb) {

		if (memoryColor[rgb] !== undefined)
			return memoryColor[rgb];

		var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
		var result, r, g, b, hex = "";
		if ((result = rgbRegex.exec(rgb))) {
			r = componentFromStr(result[1], result[2]);
			g = componentFromStr(result[3], result[4]);
			b = componentFromStr(result[5], result[6]);

			hex = "0x" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}

		memoryColor[rgb] = hex;
		return hex;
	}


	for (var x = 0; x < this.size; x++)
		for (var y = 0; y < this.size; y++)
			if (context.getImageData(0, 0, this.size, this.size).data[(x + y * this.size) * 4 + 3] !== 0) {
				var cubeColor = rgbToHex("rgb(" + context.getImageData(0, 0, this.size, this.size).data[(x + y * this.size) * 4] + "," + context.getImageData(0, 0, this.size, this.size).data[(x + y * this.size) * 4 + 1] + "," + context.getImageData(0, 0, this.size, this.size).data[(x + y * this.size) * 4 + 2] + ")");

				var pixel = new THREE.Mesh(cubes, new THREE.MeshBasicMaterial({
					color: parseInt(cubeColor)
				}));
				pixel.position.x = -x + (this.size / 2) - 0.5;
				pixel.position.y = -y + (this.size / 2) - 0.5;

				this.geometry.add(pixel);
			}


	this.add(this.geometry);
}

THREE.Item.prototype = Object.create(THREE.Object3D.prototype);