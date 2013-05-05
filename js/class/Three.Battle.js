THREE.Battle = function () {

	THREE.Object3D.call(this);

	// projector
	var projector = new THREE.Projector();

	/*
	 * Création d'un sort
	 */
	this.add = function (app) {

		if (!app.hero.ammo) {
			app.sound.effect('gunEmpty.mp3', 0.3);
			return;
		}

		app.sound.effect('gunFire.mp3', 0.5);
		app.hero.getPerson().lightGun.intensity = 5;
		app.hero.deleteAmmo();

		var vector = new THREE.Vector3(0, 0, 0.5);
		projector.unprojectVector(vector, app.camera);

		var ray = new THREE.Ray(app.hero.getCamera().position, vector.subSelf(app.hero.getCamera().position).normalize());

		var intersects = ray.intersectObjects(app.group);

		if (intersects.length > 0 && intersects[0].distance < 2000 && intersects[0].object.parent.hp >= 0) {
			intersects[0].object.parent.hp--;
			if (intersects[0].object.parent.hp)
				app.hero.argent += 100;

			app.bots[intersects[0].object.parent.idBot].setJump(2);
			app.hero.argent += Math.round(intersects[0].distance / 100);
		} else
			setTimeout(function () {
				app.sound.effect('ricoche.mp3', 0.4);
			}, 50);
	}
};

THREE.Battle.prototype = Object.create(THREE.Object3D.prototype);