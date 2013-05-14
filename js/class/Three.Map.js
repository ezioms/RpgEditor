THREE.Map = function (app) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	this.group = [];

	var region = {};

	var listImg = {};

	var listCube = {};

	var degradation = app.loader.map.degradation;
	var frequence = app.loader.map.frequence;
	var fonction = app.loader.map.fonction;


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


	var univers = new THREE.Object3D();

	var geometry = new THREE.Geometry();

	var geometryWater = new THREE.Geometry();

	var ambient = new THREE.AmbientLight(0x444444);

	var light1 = new THREE.PointLight(0xffaa00, 1, 600);

	var light2 = new THREE.PointLight(0xffaa00, 1, 600);


	var obstacles = {};
	var modules = {};
	var water = {};
	var lights = {};
	var subObstacles = {};


	/*
	 * GET light ambience
	 */
	this.getAmbience = function () {
		return ambient;
	};


	/*
	 * GET light point 1
	 */
	this.getLight1 = function () {
		return light1;
	};


	/*
	 * GET light point 2
	 */
	this.getLight2 = function () {
		return light2;
	};


	/*
	 * GET data for obstacles map current
	 */
	this.getObstacles = function () {
		return obstacles;
	};


	/*
	 * GET data for module map current
	 */
	this.getModules = function () {
		return modules;
	};


	/*
	 * GET data for univers map current
	 */
	this.getUnivers = function () {
		return univers;
	};


	/*
	 * GET water
	 */
	this.getWater = function () {
		return water;
	};


	/*
	 * GET water
	 */
	this.getSubObstacles = function () {
		return subObstacles;
	};


	/*
	 * GET data for obstacles map current
	 */
	this.getArticles = function () {
		return app.loader.map.articles[random(0, (app.loader.map.articles.length - 1))];
	};


	/*
	 * GET data for bots map current
	 */
	this.getBots = function () {
		return app.loader.bots.list ? app.loader.bots.list : false;
	};


	/*
	 * GET la couleur de fond de la map
	 */
	this.getBackgroundColor = function () {
		return app.loader.map.colorBackground ? app.loader.map.colorBackground : 0x8fa2ff;
	};


	/*
	 * GET obstacles
	 */
	this.hasObstacle = function (x, y, z) {
		if (obstacles[x] != undefined && obstacles[x][y] != undefined && obstacles[x][y][z] != undefined && obstacles[x][y][z] === true)
			return true;

		return false;
	};


	/*
	 * GET obstacles small
	 */
	this.hasObstacleSmall = function (x, y, z, subX, subY, subZ) {
		if (subObstacles[x] != undefined
			&& subObstacles[x][y] != undefined
			&& subObstacles[x][y][z] != undefined
			&& subObstacles[x][y][z][subX] != undefined
			&& subObstacles[x][y][z][subX][subY] != undefined
			&& subObstacles[x][y][z][subX][subY][subZ] != undefined
			&& subObstacles[x][y][z][subX][subY][subZ] === true)
			return true;

		return false;
	};


	/*
	 * GET water
	 */
	this.hasWater = function (x, y, z) {
		y += 1;
		if (region.water[x] != undefined && region.water[x][y] != undefined && region.water[x][y][z] != undefined && region.water[x][y][z] === true)
			return true;

		return false;
	};


	/*
	 * GET light ambience
	 */
	this.getOtherElements = function () {
		return eval(fonction);
	};


	/*
	 * Tool load image / gestion en cache
	 */
	var materials = [];
	var index = -1;
	this.loadTexture = function (path) {
		if (listImg[path.src] !== undefined)
			return listImg[path.src];

		var material = new THREE.MeshLambertMaterial({
			map: new THREE.Texture(path, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter),
			ambient: 0xbbbbbb,
			wireframe: this.wireframe,
			transparent: true,
			side: 2
		});
		material.map.needsUpdate = true;

		materials.push(material);
		index++;

		return listImg[path.src] = index;
	};


	/*
	 * UPDATE map
	 */
	this.update = function (app) {
		var delta = app.clock.getElapsedTime();
		var timeDelta = delta % 600;

		if (timeDelta < 100)
			app.map.getAmbience().color.setHex(0x444444);
		else if (timeDelta < 200)
			app.map.getAmbience().color.setHex(0x555555);
		else if (timeDelta < 300)
			app.map.getAmbience().color.setHex(0x666666);
		else if (timeDelta < 400)
			app.map.getAmbience().color.setHex(0x555555);
		else if (timeDelta < 500)
			app.map.getAmbience().color.setHex(0x444444);
		else
			app.map.getAmbience().color.setHex(0x333333);

		var minDistance1 = {
			distance: null,
			value: null,
			name: null
		};

		for (var keyLight in lights) {
			var distance = app.hero.getCamera().position.distanceTo(lights[keyLight]);
			if (distance > 1500 || (minDistance1.distance && minDistance1.distance < distance))
				continue;

			minDistance1.distance = distance;
			minDistance1.name = keyLight;
			minDistance1.value = lights[keyLight];
		}

		var minDistance2 = {
			distance: null,
			value: null,
			name: null
		};

		for (var keyLight in lights) {
			var distance = app.hero.getCamera().position.distanceTo(lights[keyLight]);

			if (distance > 1500 || distance == minDistance1.distance || (minDistance2.distance && minDistance2.distance < distance))
				continue;

			minDistance2.distance = distance;
			minDistance2.name = keyLight;
			minDistance2.value = lights[keyLight];
		}

		light1.intensity = random(70, 100) / 100;
		if (minDistance1.value) {
			light1.position.set(minDistance1.value.x, minDistance1.value.y + sizeBloc + random(0, 10), minDistance1.value.z);
			light1.visible = true;
		}
		else
			light1.visible = false;

		light2.intensity = random(70, 100) / 100;
		if (minDistance2.value) {
			light2.position.set(minDistance2.value.x, minDistance2.value.y + sizeBloc + random(0, 10), minDistance2.value.z);
			light2.visible = true;
		}
		else
			light2.visible = false;
	};


	/*
	 * Create element
	 */
	var cubeMesh = new THREE.CubeGeometry(sizeBloc, sizeBloc, sizeBloc);
	var cubeMeshSmall = new THREE.CubeGeometry(sizeBloc / 5, sizeBloc / 5, sizeBloc / 5);
	this.addCube = function (row, small) {

		var mesh = new THREE.Mesh(small === true ? cubeMeshSmall : cubeMesh);

		for (keyImg in row.materials)
			mesh.geometry.faces[keyImg].materialIndex = this.loadTexture(row.materials[keyImg]);

		return mesh;
	};


	/*
	 * GET if over module
	 */
	this.getOverModule = function (position) {
		var x = position.x;
		var y = position.y;
		var z = position.z;

		if (region.modules[x + '-' + y + '-' + z] != undefined)
			return region.modules[x + '-' + y + '-' + z];

		return false;
	};


	/*
	 * GET if over module
	 */
	this.deleteOverModule = function (position) {
		var x = Math.floor(position.x);
		var y = Math.floor(position.y) - 1;
		var z = Math.floor(position.z);

		if (region.modules[x + '-' + y + '-' + z] != undefined)
			delete region.modules[x + '-' + y + '-' + z];
	};


	/*
	 * CONSTRUCTOR
	 */
	var material = new THREE.Texture(app.loader.map.materials, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
	material.wrapS = material.wrapT = THREE.RepeatWrapping;
	material.repeat.set(infoSize.xMax, infoSize.zMax);
	material.needsUpdate = true;

	var mesh = new THREE.Mesh(new THREE.CubeGeometry(maxX, maxY, maxZ, infoSize.xMax, infoSize.yMax, infoSize.zMax), new THREE.MeshLambertMaterial({
		map: material,
		wireframe: this.wireframe,
		ambient: 0xbbbbbb,
		side: 2
	}));
	mesh.position.y = (maxY / 2) + (sizeBloc / 2);

	univers.add(mesh);

	for (var x = 0; x <= infoSize.xMax + 1; x++) {
		obstacles[x] = {};
		water[x] = {};
		subObstacles[x] = {};
		for (var y = 0; y <= infoSize.yMax + 1; y++) {
			obstacles[x][y] = {};
			water[x][y] = {};
			subObstacles[x][y] = {};
			for (var z = 0; z <= infoSize.zMax + 1; z++) {
				obstacles[x][y][z] = y == 0 ? true : false;
				water[x][y][z] = false;
				subObstacles[x][y][z] = {};
				for (var x2 = 0; x2 <= 5; x2++) {
					subObstacles[x][y][z][x2] = {};
					for (var y2 = 0; y2 <= 5; y2++) {
						subObstacles[x][y][z][x2][y2] = {};
						for (var z2 = 0; z2 <= 5; z2++) {
							subObstacles[x][y][z][x2][y2][z2] = false;
						}
					}
				}
			}
		}
	}

	for (var keyEle in app.loader.map.elements) {
		var row = app.loader.map.elements[keyEle];
		if (row.subX > 0 || row.subY > 0 || row.subZ > 0)
			subObstacles[row.x][row.y][row.z][row.subX][row.subY][row.subZ] = true;
		else {
			if (row.materials[0].src.replace(url_script + 'images/background/', '') != 'water.png')
				obstacles[row.x][row.y][row.z] = true;
			else
				water[row.x][row.y][row.z] = true;
		}
	}

	for (var keyModule in app.loader.map.modules)
		if (app.loader.map.modules[keyModule].data.module == 'light')
			lights[app.loader.map.modules[keyModule].x + '-' + app.loader.map.modules[keyModule].y + '-' + app.loader.map.modules[keyModule].z] = new THREE.Vector3(-middleMaxX + app.loader.map.modules[keyModule].x * sizeBloc - middle, app.loader.map.modules[keyModule].y * sizeBloc, -middleMaxZ + app.loader.map.modules[keyModule].z * sizeBloc - middle)
		else
			modules[app.loader.map.modules[keyModule].x + '-' + app.loader.map.modules[keyModule].y + '-' + app.loader.map.modules[keyModule].z] = app.loader.map.modules[keyModule];

	for (var keyEle2 in app.loader.map.elements) {
		var row = app.loader.map.elements[keyEle2];
		var cube;
		var filter = row.materials[0].src.replace(url_script + 'images/background/', '');

		if (filter == 'spacer.png')
			continue;

		if (filter == 'water.png') {
			cube = this.addCube(row);
			cube.position.set(-middleMaxX + row.x * sizeBloc - middle, row.y * sizeBloc, -middleMaxZ + row.z * sizeBloc - middle);
			THREE.GeometryUtils.merge(geometryWater, cube);
		} else {
			if (row.subX > 0 || row.subY > 0 || row.subZ > 0) {
				cube = this.addCube(row, true);
				cube.position.set(-middleMaxX + row.x * sizeBloc - 5 - ( 50 - row.subX * 10), row.y * sizeBloc + middle - 5 - ( 50 - row.subY * 10), -middleMaxZ + row.z * sizeBloc - 5 - ( 50 - row.subZ * 10));
			} else {
				cube = this.addCube(row);
				cube.position.set(-middleMaxX + row.x * sizeBloc - middle, row.y * sizeBloc, -middleMaxZ + row.z * sizeBloc - middle);
			}
			THREE.GeometryUtils.merge(geometry, cube);
		}
	}


	// deformation des vertices
	for (var i = 0, l = geometry.vertices.length; i < l; i++) {
		if (random(0, 100) > frequence)
			continue;
		geometry.vertices[ i ].x += Math.random() * degradation;
		geometry.vertices[ i ].y += Math.random() * (degradation * 2);
		geometry.vertices[ i ].z += Math.random() * degradation;
	}


	var material = new THREE.MeshFaceMaterial(materials);
	var element = new THREE.Mesh(geometry, material);
	var elementWater = new THREE.Mesh(geometryWater, material);

	univers.add(element);
	univers.add(elementWater);

	univers.name = 'map';

	region = {
		univers: univers,
		obstacles: obstacles,
		subObstacles: subObstacles,
		modules: modules,
		lights: lights,
		water: water
	};
};

THREE.Map.prototype = Object.create(THREE.Object3D.prototype);