THREE.Map = function (app) {

	THREE.Object3D.call(this);

	this.wireframe = false;

	var univers = new THREE.Object3D();

	var geometry = new THREE.Geometry();

	var ambient = new THREE.AmbientLight(0x222222);

	var light = new THREE.DirectionalLight(0xffffff, 0);
	//light.position.set(3000, 4000, 3000);
	//light.target.position.set(0, 0, 0);

	//light.shadowCameraVisible = this.wireframe;
	//light.shadowCameraNear = 0.01;
	//light.castShadow = true;
	//light.shadowDarkness = 0.5;

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

	/*
	 * GET light spot
	 */
	this.getLight = function () {
		return light;
	};


	/*
	 * GET light ambience
	 */
	this.getAmbience = function () {
		return ambient;
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
			px: obstacles[row.x + 1][row.y][row.z] ? false : true,
			nx: obstacles[row.x - 1][row.y][row.z] ? false : true,
			py: obstacles[row.x][row.y + 1][row.z] ? false : true,
			ny: obstacles[row.x][row.y - 1][row.z] ? false : true,
			pz: obstacles[row.x][row.y][row.z + 1] ? false : true,
			nz: obstacles[row.x][row.y][row.z - 1] ? false : true
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
	 * CONSTRUCTOR
	 */
	var obstacles = {};
	var modules = {};

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
		modules[app.loader.map.modules[keyModule].x + '-' + app.loader.map.modules[keyModule].y + '-' + app.loader.map.modules[keyModule].z] = app.loader.map.modules[keyModule];

	for (var keyEle in app.loader.map.elements) {
		var row = app.loader.map.elements[keyEle];
		var cube = this.addCube(row, obstacles);

		cube.position.set(-middleMaxX + row.x * sizeBloc - middle, row.y * sizeBloc, -middleMaxZ + row.z * sizeBloc - middle);

		THREE.GeometryUtils.merge(geometry, cube);
	}

	var material = new THREE.Texture(app.loader.map.materials, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
	material.wrapS = material.wrapT = THREE.RepeatWrapping;
	material.repeat.set(infoSize.xMax, infoSize.zMax);
	material.needsUpdate = true;

	var mesh = new THREE.Mesh(new THREE.CubeGeometry(maxX, 10, maxZ, 0, 0, 0, new THREE.MeshLambertMaterial({
		map: material,
		wireframe: this.wireframe,
		ambient: 0xbbbbbb
	}), {px: false, nx: false, py: true, ny: false, pz: false, nz: false}));
	mesh.position.y = sizeBloc / 2;

	//THREE.GeometryUtils.merge(geometry, mesh);

	var element = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
	//element.castShadow = true;
	//element.receiveShadow = true;


	univers.add(element);

	univers.name = 'map';

	region = {
		univers: univers,
		obstacles: obstacles,
		modules: modules
	};
};

THREE.Map.prototype = Object.create(THREE.Object3D.prototype);