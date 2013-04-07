var SIMULE_KEY;

if (!Detector.webgl)
    Detector.addGetWebGLMessage();

/*
 * Chargement des classes
 */

var stats;
var control = false;
var buttonEnter = false;

app = {};

app.scene = new THREE.Scene();
app.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000);
app.loader = new THREE.Loader();
app.clock = new THREE.Clock();
app.sound = new THREE.Sound();
app.node = new THREE.Node(app);
app.overlay = new THREE.Overlay();


app.renderer = {};
app.hero = {};
app.map = {};
app.bots = {};
app.users = {};
app.messages = [];
app.alert = false;
app.gamepad = gamepadSupport;


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
 * Chargement des données et pré-traitement
 */
var load = function () {
    info(app.loader.stateLoad);

    if (!app.loader.getCompleted()) {
        $('#content_loading').html(app.loader.stateLoad);
        setTimeout(load, 1);
        return;
    } else
        $('#content_loading').html('Initialisation des données');

    $('#user_hp, #user_niveau, #user_argent_content').show();

    app.gamepad.init();
    app.node.init();
    init();
}


/*
 * Initialisation de la map
 */
function init() {
    info('Chargement de ' + number_format(app.loader.nbrBot) + ' bot(s)');
    info('Chargement de ' + number_format(app.loader.nbrElements) + ' élement(s)');

    if (debug) {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0';
        stats.domElement.style.left = '0';
        $('body').append(stats.domElement);
    }

    app.map = new THREE.Map(app);

    app.hero = new THREE.Hero(app);

    app.scene.add(app.map.getUnivers(app.hero.region));
    app.scene.add(app.map.getAmbience());
    app.scene.add(app.map.getLight());

    app.scene.add(app.hero.getCamera());
    app.scene.add(app.hero.person);


    var bots = app.map.getBots(app.hero.region);
    if (bots)
        for (var keyBot in bots) {
            var bot = new THREE.Bot(app, bots[keyBot]);
            app.bots[bot.id] = bot;
            app.scene.add(bot.person);
        }


    app.renderer = new THREE.WebGLRenderer({
        clearColor: app.loader.map.colorBackground
    });
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.renderer.shadowMapEnabled = true;
    app.renderer.sortObjects = false;


    $('#content_body').hide().html(app.renderer.domElement).delay(100).fadeIn();

    $('#content_loading').empty();

    if (app.loader.map.music)
        app.sound.ambience(app.loader.map.music);

    animate();

    window.addEventListener('resize', onWindowResize, false);
}


/*
 * Rendu du canvas
 */
function render() {

    if (app.scene === undefined)
        return;

    if (!control)
        $('#noCursor').show();

    if (app.hero.hp <= 0) {
        app.hero.setPosition(1, 1, 1)
        app.hero.hp = 100;
        set_barre('#user_hp', app.hero.hp);
        app.messages.push('GAME OVER');
    }

    app.hero.update(app);

    updateHeroVisual();
    app.node.send(app.hero);

    /* Users */
    var listUsers = app.node.listUser();
    if (listUsers)
        for (var keyUser in listUsers) {
            if (listUsers[keyUser].region == app.hero.region) {
                if (listUsers[keyUser]) {
                    if (app.users[keyUser] == undefined) {
                        app.users[keyUser] = new THREE.User(listUsers[keyUser], app.loader, app.sound);
                        app.scene.add(app.users[keyUser].person);
                    }
                    else
                        app.users[keyUser].update(listUsers[keyUser]);
                } else if (!listUsers[keyUser] && app.users[keyUser] != undefined) {
                    app.scene.remove(app.users[keyUser].person);
                    app.renderer.deallocateObject(app.users[keyUser].person);
                    delete app.users[keyUser];
                    app.node.deleteUser(keyUser);
                }
            }
        }

    /* Bots */
    for (var keyBot in app.bots)
        app.bots[keyBot].update(app);

    for (var keyChildren in app.scene.children) {
        if (app.scene.children[keyChildren].name != 'hero' && app.scene.children[keyChildren] instanceof THREE.Person) {
            var person = app.scene.children[keyChildren].position;
            var hero = app.hero.person.position;
            if (hero.x > person.x - 150 && hero.x < person.x + 150
                && hero.y > person.y - 150 && hero.y < person.y + 150
                && hero.z > person.z - 150 && hero.z < person.z + 150) {
                app.scene.children[keyChildren].text.visible = true;
            }
            else
                app.scene.children[keyChildren].text.visible = false;
        }
    }

    app.sound.update(app);

    app.renderer.render(app.scene, app.camera);

    if (debug) {
        var info = app.renderer.info;
        $('#debugWebGL').html('<b>Memory Geometrie</b> : ' + info.memory.geometries + ' - <b>Memory programs</b> : ' + info.memory.programs + ' - <b>Memory textures</b> : ' + info.memory.textures + ' - <b>Render calls</b> : ' + info.render.calls + ' - <b>Render vertices</b> : ' + info.render.vertices + ' - <b>Render faces</b> : ' + info.render.faces + ' - <b>Render points</b> : ' + info.render.points);
    }
}


/*
 * Charger map current
 */
var reloadMap = function () {
    for (var keyBotRemove in app.bots) {
        app.scene.remove(app.bots[keyBotRemove].person);
        delete app.bots[keyBotRemove];
    }

    for (var key in app.scene.children)
        if (app.scene.children[key].name == 'map') {
            app.scene.remove(app.scene.children[key]);
            break;
        }

    app.scene.add(app.map.getUnivers(app.hero.region));

    app.renderer.setClearColorHex(app.loader.maps['region_' + app.hero.region].map.colorBackground);

    var bots = app.map.getBots(app.hero.region);
    app.bots = {};
    if (bots)
        for (var keyBot in bots) {
            var bot = new THREE.Bot(app, bots[keyBot]);
            app.bots[bot.id] = bot;
            app.scene.add(bot.person);
        }
};


/*
 * Loop pour l'animation
 */
function animate() {
    requestAnimationFrame(animate);

    if (app.scene === undefined)
        return;

    render();

    if (debug)
        stats.update();
}


/*
 * Traitement du resize de la fenetre
 */
function onWindowResize() {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
}


function lookMessage(txt) {
    var id = app.clock.oldTime + '_' + random(0, 100);
    $('#notifications').append('<div id="' + id + '" class="notifications">' + txt + '</div>');
    $('#' + id).fadeIn(400).delay(80 * txt.length).fadeOut(3000, function () {
        killSpeackBot();
    });
}

function killSpeackBot() {
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
 * UPDATE INTERFACE USER / GRAPHIQUE
 */
var loadMove = false;
var action = false;
function updateHeroVisual() {
    if (loadMove)
        return;

    if (!SIMULE_KEY) {
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

function simulEnter() {
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

    /*
     * MAPPING START
     */
    load();

    $(window).unload(function () {
        app.loader.request('user/update', 'GET', app.hero.getData());
    }).keyup(function (e) {
            if (e.keyCode === 13) {
                buttonEnter = SIMULE_KEY = false;
            }
        }).keydown(function (e) {
            if (e.keyCode === 13) {
                killSpeackBot();
                simulEnter();
                buttonEnter = SIMULE_KEY = true;
            }
        });


    /*
     * QUETE START
     */
    $('#accepter').live('click', function () {
        var id = $('#id_quete').val();
        $('#content_action').empty().load('actions/quete/add/' + id + '?' + app.hero.getData(), function (data) {
            if (!data)
                return;
            $('#content_action').html(data).fadeIn();
        });
    });

    $('#annul').live('click', function () {
        var id = $('#id_quete').val();
        $('#content_action').empty().load('actions/quete/annul/' + id + '?' + app.hero.getData(), function (data) {
            if (!data)
                return;
            $('#content_action').html(data).fadeIn();
        });
    });
    /*
     * QUETE STOP
     */
});