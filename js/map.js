var stats;
var control = false;
var simulate_key;
var buttonEnter = false;

app = {};

app.scene = new THREE.Scene();
app.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000);
app.loader = new THREE.Loader();
app.clock = new THREE.Clock();
app.sound = new THREE.Sound();
app.node = new THREE.Node();
app.overlay = new THREE.Overlay();


app.renderer = {};
app.hero = {};
app.map = {};
app.bots = {};
app.users = {};
app.messages = [];
app.alert = false;
app.gamepad = gamepadSupport;


/*
 * cursor management
 */
var noCursor = document.getElementById('noCursor');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

	var element = document.body;

	var pointerlockchange = function (event) {
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
			noCursor.style.display = 'none';
			lookMessage('Souris désactivé');
			control = true;
		} else {
			noCursor.style.display = 'block';
			control = false;
			lookMessage('Souris activé');
		}
	}

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', pointerlockchange, false);
	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

	noCursor.addEventListener('click', function (event) {
		activeCursor();

	}, false);

	function activeCursor() {
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if (/Firefox/i.test(navigator.userAgent)) {

			var fullscreenchange = function (event) {

				if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

					document.removeEventListener('fullscreenchange', fullscreenchange);
					document.removeEventListener('mozfullscreenchange', fullscreenchange);

					element.requestPointerLock();
				}

			}

			document.addEventListener('fullscreenchange', fullscreenchange, false);
			document.addEventListener('mozfullscreenchange', fullscreenchange, false);

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();

		} else {
			element.requestPointerLock();
		}
	}

} else {
	noCursor.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}


/*
 * Initialize datas, gamepad, node and scene
 */
var load = function () {
	info(app.loader.stateLoad);

	// load elements
	if (!app.loader.getCompleted()) {
		$('#content_loading').html(app.loader.stateLoad);
		setTimeout(load, 1);
		return;
	} else
		$('#content_loading').html('Initialisation des données');

	// show elements HTML for hero HP / SCORE ...
	$('#user_hp, #user_niveau, #user_argent_content').show();

	info('Chargement de ' + number_format(app.loader.nbrBot) + ' bot(s)');
	info('Chargement de ' + number_format(app.loader.nbrElements) + ' élement(s)');

	//stat for le debug
	if (debug) {
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0';
		stats.domElement.style.left = '0';
		$('body').append(stats.domElement);
	}

	// initialize gamepad
	app.gamepad.init();

	// initialize Socket.io
	app.node.init(app);

	// initialize the scene with objects
	init();
}


/*
 * Initialisation de la map
 */
var init = function () {
	// creat map
	app.map = new THREE.Map(app);

	// creat hero
	app.hero = new THREE.Hero(app);

	// add camera in scene
	app.scene.add(app.hero.getCamera());
	// add physic hero (camera) in scene
	app.scene.add(app.hero.getPerson());

	// add physic map in scene
	app.scene.add(app.map.getUnivers());
	// add light in scene
	app.scene.add(app.map.getAmbience());
	// add spot for shadow in scene
	app.scene.add(app.map.getLight());

	// generate bots and add in scene
	var bots = app.map.getBots();
	if (bots)
		for (var keyBot in bots) {
			var bot = new THREE.Bot(app, bots[keyBot]);
			app.bots[bot.id] = bot;
			app.scene.add(bot.getPerson());
		}


	//generate render
	app.renderer = new THREE.WebGLRenderer({
		clearColor: app.map.getBackgroundColor()
	});
	app.renderer.setSize(window.innerWidth, window.innerHeight);
	app.renderer.shadowMapEnabled = true;
	app.renderer.sortObjects = false;

	// load music
	if (app.loader.map.music)
		app.sound.ambience(app.loader.map.music);


	// load render in html
	$('#content_body').hide().html(app.renderer.domElement).delay(100).fadeIn();

	$('#content_loading').empty();

	// loop
	animate();

	window.addEventListener('resize', onWindowResize, false);
}


/*
 * Rendu du canvas
 */
var render = function () {
	if (!control)
		$('#noCursor').show();

	// listen others users with socket.io
	var listUsers = app.node.listUser();
	if (listUsers)
		for (var keyUser in listUsers)
			// ID is not my ID
			if (listUsers[keyUser].id != app.hero.id) {
				// if user existe and he's in my region
				if (listUsers[keyUser] != false && listUsers[keyUser].region == app.hero.region) {
					// user exist in memory
					if (app.users[keyUser] == undefined) {
						app.users[keyUser] = new THREE.User(listUsers[keyUser], app.loader, app.sound);
						app.scene.add(app.users[keyUser].getPerson());
					}
					else
						app.users[keyUser].update(listUsers[keyUser]);
				} else if (listUsers[keyUser] == false && app.users[keyUser] != undefined) {
					app.scene.remove(app.users[keyUser].getPerson());
					app.renderer.deallocateObject(app.users[keyUser].getPerson());
					delete app.users[keyUser];
					app.node.deleteUser(keyUser);
				}
			}


	// update bots in scene
	for (var keyBot in app.bots)
		app.bots[keyBot].update(app);

	// update hero
	app.hero.update(app);

	// send my information with socket.io
	app.node.send(app.hero);

	// update sound for the volume distance with hero and environment
	app.sound.update(app);

	// update the environment hero
	updateHeroVisual();

	// update stat environment
	if (debug) {
		var info = app.renderer.info;
		$('#debugWebGL').html('<b>Memory Geometrie</b> : ' + info.memory.geometries + ' - <b>Memory programs</b> : ' + info.memory.programs + ' - <b>Memory textures</b> : ' + info.memory.textures + ' - <b>Render calls</b> : ' + info.render.calls + ' - <b>Render vertices</b> : ' + info.render.vertices + ' - <b>Render faces</b> : ' + info.render.faces + ' - <b>Render points</b> : ' + info.render.points);
	}

	app.renderer.render(app.scene, app.camera);
}


/*
 * Loop for animate
 */
var animate = function () {
	requestAnimationFrame(animate);

	// the scene is not defined
	if (app.scene === undefined)
		return;

	// update the render
	render();

	// if the debug is TRUE => update
	if (debug)
		stats.update();
}


/*
 * Resize window
 */
var onWindowResize = function () {
	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();
	app.renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
 * Update notification management
 */
var lookMessage = function (txt) {
	var id = app.clock.oldTime + '_' + random(0, 100);
	$('#notifications').append('<div id="' + id + '" class="notifications">' + txt + '</div>');
	$('#' + id).fadeIn(400).delay(80 * txt.length).fadeOut(3000, function () {
		killSpeackBot();
	});
}


/*
 * look notifications bots for random messages
 */
var killSpeackBot = function () {
	if ($('.notifications').length) {
		$('.notifications').stop(true, true);
		if ($('.reponse').length) {
			var id = app.clock.oldTime + '_' + random(0, 100);
			txt = $('.reponse').html();
			$('#notifications').empty().append('<div id="' + id + '" class="notifications reponseNotification">' + txt + '</div>');
			$('#' + id).fadeIn(1000).delay(80 * txt.length).fadeOut(4000, function () {
				$(this).remove();
			});
		}
		else
			$('.notifications').remove();
	}
}


/*
 * Update user interface
 */
var loadMove = false;
var action = false;
var updateHeroVisual = function () {

	set_barre('#user_hp', app.hero.hp);

	for (var keyChildren in app.scene.children) {
		if (app.scene.children[keyChildren].name != 'hero' && app.scene.children[keyChildren] instanceof THREE.Person) {
			var person = app.scene.children[keyChildren].position;
			var hero = app.hero.getPerson().position;
			if (hero.x > person.x - 150 && hero.x < person.x + 150
				&& hero.y > person.y - 150 && hero.y < person.y + 150
				&& hero.z > person.z - 150 && hero.z < person.z + 150) {
				app.scene.children[keyChildren].text.visible = true;
			}
			else
				app.scene.children[keyChildren].text.visible = false;
		}
	}

	if (loadMove)
		return;

	if (!simulate_key) {
		if (app.gamepad.buttonB()) {
			buttonEnter = true;
			killSpeackBot();
		} else
			buttonEnter = false;
	}

	//	fenetre action module
	var module = app.map.getOverModule(app.hero.zone);

	if (module) {
		if (!action) {
			if (module.data.module == 'move') {
				$.get('actions/' + module.data.module + '?' + app.hero.getData(), function (data) {
					if (data == 'no')
						return;

					$('#content_action').html(data);

					if (module.data.title)
						app.messages.push(module.data.title);
					else
						app.messages.push('Changement de lieu');
				});
			}
			else if (module.data.module == 'html') {
				$('#content_action').html(module.data.html);

				if (module.data.title)
					app.messages.push(module.data.title);
			}
			else if (module.data.module == 'article') {
				$('#content_action').html(module.article);

				if (module.data.title)
					app.messages.push(module.data.title);
			}
			else if (module.data.module == 'checkpoint') {
				if (module.data.title)
					app.messages.push(module.data.title);

			}
			else if (module.data.module == 'quete') {
				$.get('actions/' + module.data.module + '?' + app.hero.getData(), function (data) {
					if (data == 'no')
						return;

					if (app.gamepad.length)
						data = data.replace('la touche ENTER', 'la touche ENTER ou le bouton X de la manette');
					$('#content_action').html(data);
				});
			}

			action = true;
		}
	}
	else {
		$('#content_action').empty();
		action = false;
	}
	// lecture de message a afficher
	if (app.messages) {
		for (var keyMsg in app.messages) {
			if ($('.notifications').last().html() != app.messages[keyMsg])
				lookMessage(app.messages[keyMsg]);
			app.messages.splice(keyMsg, 1);
		}
	}


	// Vue en rouge en cas d'accident'
	if (app.alert) {
		if (!$('#alertUser').is(':visible')) {
			app.sound.play('system/159-Skill03.ogg', app.hero.position);
			$('#alertUser').show().fadeOut(Math.round(app.alert));
		}
		app.alert = false;
	}


	// changement de niveau
	if (app.hero.xp >= app.hero.xpMax) {
		app.loader.request('user/update?' + app.hero.getData());
		app.messages.push('Vous êtes passé au niveau : ' + app.hero.niveau);
	}

	set_barre('#user_hp', app.hero.hp);

	// update de donnée hero
	$('#user_argent').html(number_format(app.hero.argent) + ' pt' + (app.hero.argent > 1 ? 's' : ''));
	$('#user_niveau').html('Niveau ' + app.hero.niveau);

	if (app.gamepad.buttonX())
		simulEnter();
}

/*
 * Simular click cursor with pressKey ENTER or button gamepad
 */
var simulEnter = function () {
	if ($(":button").length) {
		$(":button").each(function () {
			var data = $(this).data();
			if (data) {
				if (data.url !== undefined) {
					$('#content_action').empty().load(data.url + '?' + app.hero.getData(), function (data) {
						if (!data)
							return;

						if (app.gamepad.length)
							data = data.replace('la touche ENTER', 'la touche ENTER ou le bouton X de la manette');
						$('#content_action').html(data).fadeIn();
					});
				}
			}
			$(this).click();
		});
	}
}


$(function () {
	if (!Detector.webgl)
		Detector.addGetWebGLMessage();

	/*
	 * Mapping start
	 */
	load();

	/*
	 * Event unload window or press key
	 */
	$(window)
		.unload(function () {
			app.loader.request('user/update', 'GET', app.hero.getData());
		})
		.keyup(function (e) {
			if (e.keyCode === 13)
				buttonEnter = simulate_key = false;
		})
		.keydown(function (e) {
			if (e.keyCode === 13) {
				killSpeackBot();
				simulEnter();
				buttonEnter = simulate_key = true;
			}
		});


	/*
	 * Quete / mission start
	 */
	$('#content_action')
		.on('click', '#accepter', function (event) {
			event.preventDefault();
			var id = $('#id_quete').val();
			$('#content_action').empty().load('actions/quete/add/' + id + '?' + app.hero.getData(), function (data) {
				if (data)
					$(this).html(data).fadeIn();
			});
		})
		.on('click', '#annul', function (event) {
			event.preventDefault();
			var id = $('#id_quete').val();
			$('#content_action').empty().load('actions/quete/annul/' + id + '?' + app.hero.getData(), function (data) {
				if (data)
					$(this).html(data).fadeIn();
			});
		});
});