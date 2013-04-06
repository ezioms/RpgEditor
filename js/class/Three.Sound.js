THREE.Sound = function() {

		this.position = new THREE.Vector3(0, 0, 0);

		this.audioMove = {
				volume: 0.1
		};

		this.play = function(data, position) {
				if (!data || !position)
						return;

				var distance = this.distance(position, this.position);
				var volume = 1 - distance / 1000;

				if (volume < 0)
						return;

				var audioElement = document.getElementById(data);
				try
				{
						if (!audioElement) {
								audioElement = document.getElementById('content_body').appendChild(document.createElement("audio"));
								audioElement.src = dir_script + 'audio/' + data;
								audioElement.id = data;
								audioElement.load();
						}

						audioElement.currentTime = 0;
						audioElement.volume = volume;
						audioElement.play();
				}
				catch (err) {
						info('Loading : ' + data);
				}
		};


		this.effect = function(data, volume) {

				if (!data)
						return;

				if (!volume)
						volume = 0.5;

				var audioElement = document.getElementById(data);
				try
				{
						if (!audioElement) {
								audioElement = document.getElementById('content_body').appendChild(document.createElement("audio"));
								audioElement.src = dir_script + 'audio/' + data;
								audioElement.id = data;
								audioElement.load();
						}

						audioElement.currentTime = 0;
						audioElement.volume = volume;
						audioElement.play();
				}
				catch (err) {
						info('Loading : ' + data);
				}
		};


		this.ambience = function(data) {
				if (!data)
						return;

				var audioElement = document.getElementById(data);

				try
				{
						if (!audioElement) {
								audioElement = document.getElementById('content_body').appendChild(document.createElement("audio"));
								audioElement.src = dir_script + 'audio/' + data;
								audioElement.id = data;
								audioElement.loop = true;
								audioElement.load();
						}

						audioElement.volume = 0.5;
						audioElement.play();
				}
				catch (err) {
						info('Loading : ' + data);
				}
		};


		this.move = function(play) {

				this.audioMove = document.getElementById('moveHero');
				try
				{
						if (!this.audioMove) {
								this.audioMove = document.getElementById('content_body').appendChild(document.createElement("audio"));
								this.audioMove.src = dir_script + 'audio//system/013-Move01.ogg';
								this.audioMove.id = 'moveHero';
								this.audioMove.loop = true;
								this.audioMove.load();
						}

						if (!play) {
								this.audioMove.currentTime = 0;
								this.audioMove.pause();
								return;
						}

						this.audioMove.play();
				}
				catch (err) {
						info('Loading : move');
				}
		};


		this.distance = function(v1, v2) {
				var v = new THREE.Vector3(0, 0, 0);
				v.x = v1.x - v2.x;
				v.y = v1.y - v2.y;
				v.z = v1.z - v2.z;
				return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
		};


		this.update = function(app) {
				this.position = app.hero.position.clone();
		};
}