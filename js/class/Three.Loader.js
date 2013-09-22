THREE.PreLoader = function () {

	/** @namespace window.url_script */
	var url_script = window.url_script || './';
	/** @namespace window.dir_script */
	var dir_script = window.dir_script || './';

	this.datas = {
		map: {},
		my: {},
		items: {},
		bots: {},
		sounds: {}
	};

	this.map = {
		degradation: null,
		frequence: null,
		fonction: null,
		skybox: null,
		listMaterials: null,
		size: {
			elements: {
				xMax: null,
				zMax: null,
				xMax: null
			}},
		ambiance: null,
		sun: null,
		articles: null,
		modules: [],
		music : null
	};

	this.my = {
		positionX: null,
		positionY: null,
		positionZ: null
	};

	this.bots = {};

	this.sounds = {};

	this.listImg = {};

	this.listAudio = {};

	this.nbrBot = 0;

	this.nbrElements = 0;

	this.nbrSounds = 0;

	this.completedImage = 0;

	var contentLoading = document.getElementById('content_loading');

	var noCompletedImage = 0;


	this.stat = function (text) {
		var valid = this.completedImage - noCompletedImage;
		var pourcentage = Math.floor(valid / this.completedImage * 100);
		contentLoading.innerHTML = text + '<br/><progress value="' + pourcentage + '" max="100"></progress><br/> ' + number_format(valid) + ' / ' + number_format(this.completedImage);
	};


	this.getCompleted = function () {
		if (!this.datas)
			return false;

		this.map = this.datas.map;
		this.my = this.datas.my;
		this.my.positionX = parseFloat(this.my.positionX);
		this.my.positionY = parseFloat(this.my.positionY);
		this.my.positionZ = parseFloat(this.my.positionZ);
		this.items = this.datas.items;
		this.bots = this.datas.bots;
		this.sounds = this.datas.sounds;

		if (!this.completedImage) {
			// hero
			this.completedImage += 1;

			// bots
			this.completedImage += this.bots.list.length;
			this.nbrBot += this.bots.list.length;

			// map
			this.completedImage++; // background
			this.completedImage += this.map.listMaterials.length;

			// sounds
			for (var i = 0; i < this.sounds.length; i++) {
				this.completedImage++;
				this.nbrSounds++;
			}
		}

		noCompletedImage = this.completedImage;

		if (this.getMapCompleted() && this.getBotCompleted() && this.getMyCompleted() && this.getSoundsCompleted()) {
			this.stat('Chargement de l\'environnement');
			this.setMapCurrent();
			return true;
		}

		return false;
	};


	/*
	 * Hero
	 */
	this.getMyCompleted = function () {
		var noComplete = 0;

		if (typeof this.my.img == 'string')
			this.my.img = this.loadImage(dir_script + 'images/character/' + this.my.img);

		if (!this.my.img.complete)
			noComplete++;
		else
			noCompletedImage--;

		this.stat('Chargement du héro');

		return noComplete ? false : true;
	};


	/*
	 * Map
	 */
	this.getMapCompleted = function () {
		var noComplete = 0;

		if (app.loader.map.colorBackground == '0x000000')
			app.loader.map.colorBackground = '0x111111';

		eval('app.loader.map.ambiance = ' + app.loader.map.ambiance + ';');
		eval('app.loader.map.colorBackground = ' + app.loader.map.colorBackground + ';');

		for (var key in this.map.listMaterials) {
			if (typeof this.map.listMaterials[key] == 'string')
				this.map.listMaterials[key] = this.loadImage(dir_script + this.map.listMaterials[key]);

			if (!this.map.listMaterials[key].complete)
				noComplete++;
			else
				noCompletedImage--;

			this.stat('Chargement des textures pour la carte');
		}

		if (typeof this.map.materials == 'string')
			this.map.materials = this.loadImage(dir_script + 'images/background/' + this.map.materials);

		if (!this.map.materials.complete)
			noComplete++;
		else
			noCompletedImage--;

		this.stat('Chargement de la textures pour le sol de la carte');

		return noComplete ? false : true;
	};


	/*
	 * Bots
	 */
	this.getBotCompleted = function () {
		var noComplete = 0;

		for (var key in this.bots.list) {
			if (typeof this.bots.list[key].img == 'string')
				this.bots.list[key].img = this.loadImage(dir_script + 'images/' + this.bots.list[key].img);

			if (!this.bots.list[key].img.complete)
				noComplete++;
			else
				noCompletedImage--;

			this.stat('Chargement des pnj');
		}
		return noComplete ? false : true;
	};


	/*
	 * Sound
	 */
	this.getSoundsCompleted = function () {
		var noComplete = 0;

		for (var keySound in this.sounds) {
			if (this.listAudio[this.sounds[keySound]] == undefined) {
				this.listAudio[this.sounds[keySound]] = new Audio(dir_script + 'audios/' + this.sounds[keySound]);
				this.listAudio[this.sounds[keySound]].load();
				noComplete++;
			}
			else
				noCompletedImage--;

			this.stat('Chargement des pistes audio');
		}
		return noComplete ? false : true;
	};


	/*
	 * Cache image
	 */
	this.loadImage = function (path) {
		if (this.listImg[path] !== undefined)
			return this.listImg[path];

		this.listImg[path] = new Image();
		this.listImg[path].src = path;
		this.listImg[path].type = path.replace(dir_script + 'images/', '');

		return this.listImg[path];
	};


	/*
	 * On charge les donnée de la map current
	 */
	this.setMapCurrent = function (callback) {
		this.map = this.map;
		this.bots = this.bots;

		if (callback && typeof(callback) === 'function')
			callback();
	};


	this.request = function (url, type, params, callback) {

		var http;

		if (window.XMLHttpRequest || window.ActiveXObject) {
			if (window.ActiveXObject) {
				try {
					http = new ActiveXObject('Msxml2.XMLHTTP');
				} catch (e) {
					http = new ActiveXObject('Microsoft.XMLHTTP');
				}
			}
			else
				http = new XMLHttpRequest();

			if (!type || type == 'GET') {
				if (params)
					url += "?" + params;

				http.open('GET', url_script + url, false);
				http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				http.send(null);
			} else {
				http.open('POST', url_script + url, false);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				http.setRequestHeader("Content-length", params.length);
				http.setRequestHeader("Connection", "close");
				http.send(params);
			}

			if (http.readyState != 4 || (http.status != 200 && http.status != 0))
				throw new Error('Code HTTP : ' + http.status);
			else {
				var result = null;
				if (http.responseText)
					eval('result = ' + http.responseText);

				if (callback && typeof(callback) === 'function')
					callback();

				return result;
			}
		}
		else
			log('Error XMLHTTPRequest');

		return null;
	};


	this.datas = this.request('map');
};