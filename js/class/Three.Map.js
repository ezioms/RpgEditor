THREE.Map = function (app) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	var univers = new THREE.Object3D();

	var geometry = new THREE.Geometry();

	var ambient = new THREE.AmbientLight(0x333333);

	var light1 = new THREE.PointLight(0xffaa00, 0.8, 400);

	var light2 = new THREE.PointLight(0xffaa00, 0.8, 400);

	var region = {};

	var listImg = {};

	var listCube = {};


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


	var obstacles = {};
	var modules = {};
	var lights = {};


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
	this.getArticles = function () {
		var article = app.loader.map.articles[random(0, (app.loader.map.articles.length - 1))];
		return article ? article : false;
	};


	/*
	 * GET data for obstacles map current
	 */
	this.getObstacles = function () {
		return region.obstacles ? region.obstacles : false;
	};


	/*
	 * GET data for module map current
	 */
	this.getModules = function () {
		return region.modules ? region.modules : false;
	};


	/*
	 * UPDATE map
	 */
	this.update = function (app) {
		var minDistance1 = {
			distance: null,
			value: null,
			name: null
		};

		for (var keyLight in lights) {
			var distance = app.hero.getCamera().position.distanceTo(lights[keyLight]);
			if (minDistance1.distance && minDistance1.distance < distance)
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

			if (distance == minDistance1.distance)
				continue;

			if (minDistance2.distance && minDistance2.distance < distance)
				continue;

			minDistance2.distance = distance;
			minDistance2.name = keyLight;
			minDistance2.value = lights[keyLight];
		}

		console.log(minDistance1, minDistance2);
		light1.position.set(minDistance1.value.x, minDistance1.value.y, minDistance1.value.z);
		light2.position.set(minDistance2.value.x, minDistance2.value.y, minDistance2.value.z);
	};


	/*
	 * GET data for univers map current
	 */
	this.getUnivers = function () {
		return region.univers ? region.univers : false;
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
		if (region.obstacles[x] != undefined && region.obstacles[x][y] != undefined && region.obstacles[x][y][z] != undefined && region.obstacles[x][y][z])
			return true;

		return false;
	};


	/*
	 * Tool load image / gestion en cache
	 */
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

		return listImg[path.src] = material;
	};


	/*
	 * Create element
	 */
	this.addCube = function (row, obstacles) {
		var title = [];
		var faces = {
			px: /* obstacles[row.x + 1][row.y][row.z] ? false : */true,
			nx: /* obstacles[row.x - 1][row.y][row.z] ? false : */true,
			py: /* obstacles[row.x][row.y + 1][row.z] ? false : */true,
			ny: /* obstacles[row.x][row.y - 1][row.z] ? false : */true,
			pz: /* obstacles[row.x][row.y][row.z + 1] ? false : */true,
			nz: /* obstacles[row.x][row.y][row.z - 1] ? false : */true
		};

		if (Object.prototype.toString.apply(row.materials) === '[object Array]') {
			for (keyImg in row.materials)
				if (row.materials) {
					title.push(row.materials[keyImg].src);
					row.materials[keyImg] = this.loadTexture(row.materials[keyImg]);
				}
		}
		else if (row.materials) {
			title.push(row.materials.src);
			row.materials = this.loadTexture(row.materials);
		}

		title = title.join('-') + '-' + faces.px + '-' + faces.nx + '-' + faces.py + '-' + faces.ny + '-' + faces.pz + '-' + faces.nz;

		if (listCube[title] !== undefined)
			return listCube[title];

		return listCube[title] = new THREE.Mesh(new THREE.CubeGeometry(sizeBloc, sizeBloc, sizeBloc, 0, 0, 0, row.materials, faces));
	};


	/*
	 * GET if over module
	 */
	this.getOverModule = function (position) {
		var x = Math.floor(position.x);
		var y = Math.floor(position.y);
		var z = Math.floor(position.z);

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

	var mesh = new THREE.Mesh(new THREE.CubeGeometry(maxX, maxY, maxZ, infoSize.xMax, infoSize.yMax, infoSize.zMax, new THREE.MeshLambertMaterial({
		map: material,
		wireframe: this.wireframe,
		ambient: 0xbbbbbb,
		side: 2
	})));
	mesh.position.y = (maxY / 2) + (sizeBloc / 2);

	THREE.GeometryUtils.merge(geometry, mesh);

	for (var x = 0; x <= infoSize.xMax + 1; x++) {
		obstacles[x] = {};
		for (var y = 0; y <= infoSize.yMax + 1; y++) {
			obstacles[x][y] = {};
			for (var z = 0; z <= infoSize.zMax + 1; z++)
				obstacles[x][y][z] = y == 0 ? true : false;
		}
	}

	for (var keyEl in app.loader.map.elements)
		obstacles[app.loader.map.elements[keyEl].x][app.loader.map.elements[keyEl].y][app.loader.map.elements[keyEl].z] = true;

	for (var keyModule in app.loader.map.modules)
		if (app.loader.map.modules[keyModule].data.module == 'light')
			lights[app.loader.map.modules[keyModule].x + '-' + app.loader.map.modules[keyModule].y + '-' + app.loader.map.modules[keyModule].z] = new THREE.Vector3(-middleMaxX + app.loader.map.modules[keyModule].x * sizeBloc - middle, app.loader.map.modules[keyModule].y * sizeBloc, -middleMaxZ + app.loader.map.modules[keyModule].z * sizeBloc - middle)
		else
			modules[app.loader.map.modules[keyModule].x + '-' + app.loader.map.modules[keyModule].y + '-' + app.loader.map.modules[keyModule].z] = app.loader.map.modules[keyModule];

	for (var keyEle in app.loader.map.elements) {
		var row = app.loader.map.elements[keyEle];
		var cube = this.addCube(row, obstacles);

		cube.position.set(-middleMaxX + row.x * sizeBloc - middle, row.y * sizeBloc, -middleMaxZ + row.z * sizeBloc - middle);

		THREE.GeometryUtils.merge(geometry, cube);
	}

	var element = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());

	univers.add(element);

	univers.name = 'map';

	region = {
		univers: univers,
		obstacles: obstacles,
		modules: modules,
		lights: lights
	};
};

THREE.Map.prototype = Object.create(THREE.Object3D.prototype);