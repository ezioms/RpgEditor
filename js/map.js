var stats;
var control = false;
var simulate_key;
var buttonEnter = false;


/*
 * element div ID
 */
var contentLoading = document.getElementById('content_loading');
var contentBody = document.getElementById('content_body');
var contentAction = document.getElementById('content_action');
var valueGraph = document.getElementById('valueMoyenneGraph');
var contentGraph = document.getElementById('ContenuGraphique');
var userHp = document.getElementById('user_hp');
var userScore = document.getElementById('user_argent');
var userLevel = document.getElementById('user_niveau');
var noCursor = document.getElementById('noCursor');
var notifications = document.getElementById('notifications');
var webGL = document.getElementById('debugWebGL');


/*
 * my app
 */
app = {};

app.scene = new THREE.Scene;
app.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 8000);
app.loader = new THREE.Loader;
app.clock = new THREE.Clock;
app.sound = new THREE.Sound;
app.node = new THREE.Node;
app.overlay = new THREE.Overlay;


app.renderer = {};
app.hero = {};
app.map = {};
app.bots = {};
app.users = {};
app.messages = [];
app.alert = false;

/*
 * Initialize datas, node and scene
 */
var load = function () {
	// load elements
	if (!app.loader.getCompleted())
		return setTimeout(load, 1000 / 25);

	// show elements HTML for hero HP / SCORE ...
	userHp.style.display = userLevel.style.display = userScore.style.display = 'block';

	info(app.loader.nbrBot + ' habitant(s)');
	info(app.loader.nbrElements + ' cube(s)');

	//stat for le debug
	if (debug) {
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0';
		stats.domElement.style.left = '0';
		document.body.appendChild(stats.domElement);
	}

	// initialize Socket.io
	app.node.init(app);

	// initialize the scene with objects
	initialize();
};


/*
 * Initialisation de la map
 */
var initialize = function () {
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
	contentBody.appendChild(app.renderer.domElement);
	contentLoading.innerHTML = '';

	// loop
	animate();

	window.addEventListener('resize', onWindowResize, false);
};


/*
 * Rendu du canvas
 */
var render = function () {
	if (!control)
		noCursor.style.display = 'block';

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
	//for (var keyBot in app.bots)
	//	app.bots[keyBot].update(app);

	// update hero
	app.hero.update(app);

	// send my information with socket.io
	app.node.send(app.hero);

	// update sound for the volume distance with hero and environment
	app.sound.update(app);

	// update the environment hero
	updateHeroVisual();

	// update stat environment
	/*
	 if (debug) {
	 var info = app.renderer.info;
	 webGL.innerHTML = '<b>Memory Geometrie</b> : ' + info.memory.geometries + ' - <b>Memory programs</b> : ' + info.memory.programs + ' - <b>Memory textures</b> : ' + info.memory.textures + ' - <b>Render calls</b> : ' + info.render.calls + ' - <b>Render vertices</b> : ' + info.render.vertices + ' - <b>Render faces</b> : ' + info.render.faces + ' - <b>Render points</b> : ' + info.render.points;
	 }
	 */

	app.renderer.render(app.scene, app.camera);
};


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
};


/*
 * Resize window
 */
var onWindowResize = function () {
	app.camera.aspect = window.innerWidth / window.innerHeight;
	app.camera.updateProjectionMatrix();
	app.renderer.setSize(window.innerWidth, window.innerHeight);
};

/*
 * Update notification management
 */
var lookMessage = function (txt) {
	var id = app.clock.oldTime + '_' + random(0, 100);
	$('#notifications').append('<div id="' + id + '" class="notifications">' + txt + '</div>');
	$('#' + id).fadeIn(400).delay(80 * txt.length).fadeOut(3000, function () {
		killSpeackBot();
	});
};


/*
 * look notifications bots for random messages
 */
var killSpeackBot = function () {
	var notif = $('.notifications');
	if (notif.length) {
		notif.stop(true, true);
		if ($('.reponse').length) {
			var id = app.clock.oldTime + '_' + random(0, 100);
			var txt = $('.reponse').html();
			$('#notifications').empty().append('<div id="' + id + '" class="notifications reponseNotification">' + txt + '</div>');
			$('#' + id).fadeIn(1000).delay(80 * txt.length).fadeOut(4000, function () {
				$(this).remove();
			});
		}
		else
			notif.remove();
	}
};


/*
 * Update user interface
 */
var loadMove = false;
var action = false;
var updateHeroVisual = function () {

	for (var keyChildren in app.scene.children) {
		var child = app.scene.children[keyChildren];
		if (child.name != 'hero' && child instanceof THREE.Person) {
			var person = child.position;
			var hero = app.hero.getPerson().position;
			if (hero.x > person.x - 150 && hero.x < person.x + 150
				&& hero.y > person.y - 150 && hero.y < person.y + 150
				&& hero.z > person.z - 150 && hero.z < person.z + 150) {
				child.text.visible = true;
			}
			else
				child.text.visible = false;
		}
	}

	if (loadMove)
		return;

	// fenetre action module
	var module = app.map.getOverModule(app.hero.zone);

	if (module) {
		if (!action) {
			if (module.data.module == 'move') {
				$.get('actions/' + module.data.module + '?' + app.hero.getData(), function (data) {
					if (data == 'no')
						return;

					contentAction.innerHTML = data;
					app.messages.push(module.data.title ? module.data.title : 'Changement de lieu');
				});
			}
			else if (module.data.module == 'html') {
				contentAction.innerHTML = module.data.html;

				if (module.data.title)
					app.messages.push(module.data.title);
			}
			else if (module.data.module == 'article') {
				contentAction.innerHTML = module.article;

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

					contentAction.innerHTML = data;
				});
			}

			action = true;
		}
	}
	else {
		contentAction.innerHTML = '';
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
		var alertUser = $('#alertUser');
		if (!alertUser.is(':visible')) {
			app.sound.play('system/159-Skill03.ogg', app.hero.getPerson().position);
			alertUser.show().fadeOut(app.alert);
		}
		app.alert = false;
	}


	// changement de niveau
	if (app.hero.xp >= app.hero.xpMax) {
		app.loader.request('user/update?' + app.hero.getData());
		app.messages.push('Vous êtes passé au niveau : ' + app.hero.niveau);
	}

};

/*
 * Simular click cursor with pressKey ENTER
 */
var simulEnter = function () {
	var button = $(":button");
	if (button.length) {
		button.each(function () {
			var data = $(this).data();
			if (data) {
				if (data.url !== undefined) {
					$('#content_action').empty().load(data.url + '?' + app.hero.getData(), function (data) {
						if (!data)
							return;

						$('#content_action').html(data).fadeIn();
					});
				}
			}
			$(this).click();
		});
	}
};


/*
 * cursor management
 */

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

	var element = document.body;

	var pointerlockchange = function () {
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
			noCursor.style.display = 'none';
			lookMessage('Souris désactivé');
			control = true;
		} else {
			noCursor.style.display = 'block';
			control = false;
			lookMessage('Souris activé');
		}
	};

	var activeCursor = function () {
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if (/Firefox/i.test(navigator.userAgent)) {

			var fullscreenchange = function () {

				if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

					document.removeEventListener('fullscreenchange', fullscreenchange);
					document.removeEventListener('mozfullscreenchange', fullscreenchange);

					element.requestPointerLock();
				}
			};

			document.addEventListener('fullscreenchange', fullscreenchange, false);
			document.addEventListener('mozfullscreenchange', fullscreenchange, false);

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();

		} else
			element.requestPointerLock();
	};

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', pointerlockchange, false);
	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

	noCursor.addEventListener('click', activeCursor, false);

} else
	noCursor.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';


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
		.keyup(function (event) {
			if (event.keyCode === 13)
				buttonEnter = simulate_key = false;
		})
		.keydown(function (event) {
			if (event.keyCode === 13) {
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
			var id = $('#id_quete').val();
			$('#content_action').empty().load('actions/quete/add/' + id + '?' + app.hero.getData(), function (data) {
				if (data)
					$(this).html(data).fadeIn();
			});
			event.preventDefault();
		})
		.on('click', '#annul', function (event) {
			var id = $('#id_quete').val();
			$('#content_action').empty().load('actions/quete/annul/' + id + '?' + app.hero.getData(), function (data) {
				if (data)
					$(this).html(data).fadeIn();
			});
			event.preventDefault();
		});
});