THREE.Loader = function () {

	this.datas = false;

	this.map = null;

	this.my = null;

	this.bots = null;

	this.nbrBot = 0;

	this.nbrElements = 0;

	this.completedImage = 0;

	this.noCompletedImage = 0;

	this.listImg = {};

	var contentLoading = document.getElementById('content_loading');


	this.stat = function (text) {
		var valid = this.completedImage - this.noCompletedImage;
		var pourcentage = Math.floor(valid / this.completedImage * 100);
		contentLoading.innerHTML = text + '<br/><progress value="' + pourcentage + '" max="100"></progress><br/> ' + number_format(valid) + ' / ' + number_format(this.completedImage);
	};


	this.getCompleted = function () {

		if (!this.datas)
			return false;

		this.map = this.datas.map;
		this.my = this.datas.my;
		this.bots = this.datas.bots;

		if (!this.completedImage) {
			// hero
			this.completedImage += 1;

			// bots
			this.completedImage += this.bots.list.length;
			this.nbrBot += this.bots.list.length;

			// map
			this.completedImage += 2; // baground + wall
			for (var keyElement in this.map.elements) {
				if (Object.prototype.toString.apply(this.map.elements[keyElement].materials) === '[object Array]')
					for (keyImg in this.map.elements[keyElement].materials)
						this.completedImage++;
				else if (this.map.elements[keyElement].materials)
					this.completedImage++;

				this.nbrElements++;
			}
		}

		this.noCompletedImage = this.completedImage;

		if (this.getMapCompleted() && this.getBotCompleted() && this.getMyCompleted()) {
			this.setMapCurrent();
			this.stat('Chargement fini', this.noCompletedImage);
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
			this.noCompletedImage--;

		this.stat('Chargement du héro', this.noCompletedImage);

		return noComplete ? false : true;
	};


	/*
	 * Map
	 */
	this.getMapCompleted = function () {
		var noComplete = 0;

		for (key in this.map.elements) {
			var row = this.map.elements[key].materials;

			if (Object.prototype.toString.apply(row) === '[object Array]') {
				for (keyImg in row) {
					if (typeof row[keyImg] == 'string')
						row[keyImg] = this.loadImage(dir_script + 'images/background/' + row[keyImg]);

					if (!row[keyImg].complete)
						noComplete++;
					else
						this.noCompletedImage--;
				}
			}
			else if (row) {
				if (typeof row == 'string')
					row = this.loadImage(dir_script + row);

				if (!row.complete)
					noComplete++;
				else
					this.noCompletedImage--;
			}
			this.stat('Chargement des images pour la carte', this.noCompletedImage);
		}

		if (typeof this.map.materials == 'string')
			this.map.materials = this.loadImage(dir_script + 'images/background/' + this.map.materials);

		if (!this.map.materials.complete)
			noComplete++;
		else
			this.noCompletedImage--;
		this.stat('Chargement des images pour la carte', this.noCompletedImage);

		if (typeof this.map.univers == 'string')
			this.map.univers = this.loadImage(dir_script + this.map.univers);

		if (!this.map.univers.complete)
			noComplete++;
		else
			this.noCompletedImage--;
		this.stat('Chargement des images pour la carte', this.noCompletedImage);

		return noComplete ? false : true;
	};


	/*
	 * Bots
	 */
	this.getBotCompleted = function () {
		var noComplete = 0;

		for (key in this.bots.list) {
			if (typeof this.bots.list[key].img == 'string')
				this.bots.list[key].img = this.loadImage(dir_script + 'images/' + this.bots.list[key].img);

			if (!this.bots.list[key].img.complete)
				noComplete++;
			else
				this.noCompletedImage--;

			this.stat('Chargement des habitants', this.noCompletedImage);
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
	}

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
}