THREE.Map = function(app) {

		THREE.Object3D.call(this);

		this.wireframe = false;

		this.ambient = false;

		this.regions = {};

		this.listImg = {};

		this.listCube = {};


		/*
		 * Lumière du soleil
		 */
		this.getLight = function() {

				this.light = new THREE.SpotLight(0xffffff, 2);
				this.light.position.set( 0, 10000, 1 );
				this.light.rotation.set(0, Math.PI / 2, 0);
				this.light.shadowCameraFar = 50;
				this.light.shadowCameraNear      = 0.001;     
				this.light.castShadow        = true;
				this.light.shadowDarkness        = 0.5;
				this.light.shadowCameraVisible   = true;
				this.light.shadowCameraFar = 1000;
				this.light.shadowCameraFov = 15;

				return this.light;
		};


		/*
		 * Lumière d'ambience
		 */
		this.getAmbience = function() {
				this.ambient = new THREE.AmbientLight(0x999999, 2);
				return this.ambient;
		};


		/*
		 * GET data for obstacles map current
		 */
		this.getArticles = function(id) {
				return this.regions['region_' + id].articles[random(0, (this.regions['region_' + id].articles.length - 1))];
		}


		/*
		 * GET data for obstacles map current
		 */
		this.getObstacles = function(id) {
				return this.regions['region_' + id].obstacles;
		}


		/*
		 * GET data for module map current
		 */
		this.getModules = function(id) {
				return this.regions['region_' + id].modules;
		}


		/*
		 * GET data for univers map current
		 */
		this.getUnivers = function(id) {
				return this.regions['region_' + id].univers;
		}


		/*
		 * GET data for bots map current
		 */
		this.getBots = function(id) {
				return this.regions['region_' + id].bots;
		}


		/*
		 * GET data for size map current
		 */
		this.getSize = function(id) {
				return this.regions['region_' + id].size;
		}



		/*
		 * Delete session 
		 */
		this.hasObstacle = function(x, y, z, id) {
				var obstacles = this.regions['region_' + id].obstacles;
				if (obstacles[x] != undefined && obstacles[x][y] != undefined && obstacles[x][y][z] != undefined && obstacles[x][y][z]) {
						return true;
				}
				return false;
		};


		/*
		 * Mise a jour des différents éléments du terrain
		 * Lumière soleil
		 * Forme soleil
		 * Forme lune
		 * Effet de brume
		 */
		this.update = function(app) {
				if (this.light) {
						this.light.target.lookAt(app.hero.position);
				}
		};


		/*
		 * Tool load image / gestion en cache
		 */
		this.loadTexture = function(path) {
				if (this.listImg[path.src] !== undefined)
						return this.listImg[path.src];

				var material = new THREE.MeshLambertMaterial({
						map: new THREE.Texture(path, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter),
						ambient: 0xbbbbbb,
						wireframe: this.wireframe,
						transparent: true
				});
				material.map.needsUpdate = true;

				return this.listImg[path.src] = material;
		};


		/*
		 * Create element 
		 */
		this.addCube = function(row, obstacles, map) {
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

				if (this.listCube[title] !== undefined)
						return this.listCube[title];

				return this.listCube[title] = new THREE.Mesh(new THREE.CubeGeometry(map.size.elements, map.size.elements, map.size.elements, 0, 0, 0, row.materials, faces));
		};


		this.getOverModule = function(regionID, position) {
				if (this.regions['region_' + regionID].modules[position.x + '-' + position.y + '-' + position.z] != undefined)
						return this.regions['region_' + regionID].modules[position.x + '-' + position.y + '-' + position.z];

				return false;
		};

		info('Traitement des régions');
		for (var keyUnivers in app.loader.datas.maps) {
				var map = app.loader.datas.maps[keyUnivers].map;

				var univers = new THREE.Object3D();
				var geometry = new THREE.Geometry();

				var material = new THREE.Texture(map.materials, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter);
				material.wrapS = material.wrapT = THREE.RepeatWrapping;
				material.repeat.set(map.size.xMax, map.size.zMax);
				material.needsUpdate = true;


				var mesh = new THREE.Mesh(new THREE.PlaneGeometry(map.size.xMax * map.size.elements * 2, map.size.zMax * map.size.elements * 2), new THREE.MeshLambertMaterial({
						map: material,
						wireframe: this.wireframe
				}));
				mesh.position.y = map.size.elements / 2;
				mesh.rotation.x = -90 * Math.PI / 180;
				mesh.receiveShadow = true;
				univers.add(mesh);

				material = new THREE.Texture(map.univers, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter);
				material.wrapS = material.wrapT = THREE.RepeatWrapping;
				material.needsUpdate = true;

				var faceZ = new THREE.PlaneGeometry(map.size.xMax * map.size.elements, map.size.yMax * map.size.elements);
				var faceX = new THREE.PlaneGeometry(map.size.zMax * map.size.elements, map.size.yMax * map.size.elements);
				var materialMesh = new THREE.MeshLambertMaterial({
						map: material,
						wireframe: this.wireframe,
						transparent: true
				});

				var nz = new THREE.Mesh(faceZ, materialMesh);
				nz.position.z -= map.size.zMax * map.size.elements / 2;
				nz.position.y = map.size.yMax * map.size.elements / 2;
				univers.add(nz);

				var pz = new THREE.Mesh(faceZ, materialMesh);
				pz.position.z = map.size.zMax * map.size.elements / 2;
				pz.position.y = map.size.yMax * map.size.elements / 2;
				pz.rotation.y = -180 * Math.PI / 180;
				univers.add(pz);

				var nx = new THREE.Mesh(faceX, materialMesh);
				nx.position.x -= map.size.xMax * map.size.elements / 2;
				nx.position.y = map.size.yMax * map.size.elements / 2;
				nx.rotation.y = 90 * Math.PI / 180;
				univers.add(nx);

				var px = new THREE.Mesh(faceX, materialMesh);
				px.position.x = map.size.xMax * map.size.elements / 2;
				px.position.y = map.size.yMax * map.size.elements / 2;
				px.rotation.y = -90 * Math.PI / 180;
				univers.add(px);

				var obstacles = {};
				var modules = {};
				for (var x = 0; x <= map.size.xMax + 1; x++) {
						obstacles[x] = {};
						for (var y = 0; y <= map.size.yMax + 1; y++) {
								obstacles[x][y] = {};
								for (var z = 0; z <= map.size.zMax + 1; z ++)
										obstacles[x][y][z] = y == 0 ? true : false;
						}
				}

				for (var keyEl in map.elements)
						obstacles[map.elements[keyEl].x][map.elements[keyEl].y][map.elements[keyEl].z] = true;

				for (var keyModule in map.modules)
						modules[map.modules[keyModule].x + '-' + map.modules[keyModule].y + '-' + map.modules[keyModule].z] = map.modules[keyModule];

				for (var keyEle in map.elements) {
						var row = map.elements[keyEle];
						var cube = this.addCube(row, obstacles, map);

						cube.position.x = -(map.size.xMax * map.size.elements / 2) + row.x * map.size.elements - (map.size.elements / 2);
						cube.position.y = row.y * map.size.elements;
						cube.position.z = -(map.size.zMax * map.size.elements / 2) + row.z * map.size.elements - (map.size.elements / 2);

						THREE.GeometryUtils.merge(geometry, cube);
				}

				var element = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
				element.castShadow = true;
				element.receiveShadow = true;


				univers.add(element);
				univers.name = 'map';

				this.regions[keyUnivers] = {
						univers: univers,
						obstacles: obstacles,
						modules: modules,
						bots: app.loader.datas.maps[keyUnivers].bots.list,
						articles: map.articles,
						size: map.size
				};
		}
};

THREE.Map.prototype = Object.create(THREE.Object3D.prototype);