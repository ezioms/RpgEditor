THREE.Sound = function () {

	this.position = new THREE.Vector3(0, 0, 0);

	this.audioMove = {
		volume: 0.1
	};

	this.play = function (data, position, distance) {
		if ((!data && !position ) || (!data && !distance))
			return;

		if (!distance)
			distance = this.position.distanceTo(position.position);

		var volume = 1 - distance / 400;

		if (volume < 0)
			return;

		var audioElement = app.loader.listAudio[data];
		try {
			audioElement.currentTime = 0;
			audioElement.volume = volume;
			audioElement.play();
		}
		catch (err) {
		}
	};


	this.effect = function (data, volume) {

		if (!data)
			return;

		if (!volume)
			volume = 0.5;

		var audioElement = app.loader.listAudio[data];
		try {
			audioElement.currentTime = 0;
			audioElement.volume = volume;
			audioElement.play();
		}
		catch (err) {
		}
	};


	this.ambience = function (data) {
		if (!data)
			return;

		var audioElement = app.loader.listAudio[data];

		try {
			audioElement.volume = 0.5;
			audioElement.play();
		}
		catch (err) {
		}
	};


	this.move = function (play) {
		this.audioMove = app.loader.listAudio['move.ogg'];
		try {
			if (!play) {
				this.audioMove.currentTime = 0;
				this.audioMove.pause();
				return;
			}

			this.audioMove.play();
		}
		catch (err) {
		}
	};


	this.distance = function (v1, v2) {
		var v = new THREE.Vector3(0, 0, 0);
		v.x = v1.x - v2.x;
		v.y = v1.y - v2.y;
		v.z = v1.z - v2.z;
		return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	};


	this.update = function (app) {
		this.position = app.hero.getPerson().position.clone();
	};
}