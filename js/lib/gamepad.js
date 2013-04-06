var gamepad;
var lastPress = null;
var inverse = false;
var gamepadSupport = {TYPICAL_BUTTON_COUNT: 16, TYPICAL_AXIS_COUNT: 4, ticking: false, gamepads: [], prevRawGamepadTypes: [], prevTimestamps: [], init: function() {
				var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
				if (!gamepadSupportAvailable) {
				} else {
						window.addEventListener('MozGamepadConnected', gamepadSupport.onGamepadConnect, false);
						window.addEventListener('MozGamepadDisconnected', gamepadSupport.onGamepadDisconnect, false);
						if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
								gamepadSupport.startPolling();
						}
				}
				if (gamepad == undefined || !gamepad)
						lookMessage('Aucune manette connectée');
				else
						lookMessage('Manette connectée');
		}, onGamepadConnect: function(event) {
				gamepadSupport.gamepads.push(event.gamepad);
				gamepadSupport.startPolling();
		}, onGamepadDisconnect: function(event) {
				for (var i in gamepadSupport.gamepads) {
						if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
								gamepadSupport.gamepads.splice(i, 1);
								break;
						}
				}
				if (gamepadSupport.gamepads.length == 0) {
						gamepadSupport.stopPolling();
				}
		}, startPolling: function() {
				if (!gamepadSupport.ticking) {
						gamepadSupport.ticking = true;
						gamepadSupport.tick();
				}
		}, stopPolling: function() {
				gamepadSupport.ticking = false;
		}, tick: function() {
				gamepadSupport.pollStatus();
				gamepadSupport.scheduleNextTick();
		}, scheduleNextTick: function() {
				if (gamepadSupport.ticking) {
						if (window.requestAnimationFrame) {
								window.requestAnimationFrame(gamepadSupport.tick);
						} else if (window.mozRequestAnimationFrame) {
								window.mozRequestAnimationFrame(gamepadSupport.tick);
						} else if (window.webkitRequestAnimationFrame) {
								window.webkitRequestAnimationFrame(gamepadSupport.tick);
						}
				}
		}, pollStatus: function() {
				gamepadSupport.pollGamepads();
				for (var i in gamepadSupport.gamepads) {
						var gamepad = gamepadSupport.gamepads[i];
						if (gamepad.timestamp && (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
								continue;
						}
						gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
						gamepadSupport.updateDisplay(i);
				}
		}, pollGamepads: function() {
				var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;
				if (rawGamepads) {
						gamepadSupport.gamepads = [];
						var gamepadsChanged = false;
						for (var i = 0; i < rawGamepads.length; i++) {
								if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
										gamepadsChanged = true;
										gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
								}
								if (rawGamepads[i]) {
										gamepadSupport.gamepads.push(rawGamepads[i]);
								}
						}
				}
		}, updateDisplay: function(gamepadId) {
				gamepad = gamepadSupport.gamepads[gamepadId];

				if (gamepad.buttons[4] && gamepad.buttons[5] && gamepad.buttons[6] && gamepad.buttons[7])
						window.location.reload();

				if (gamepad.buttons[8] && this.press()) {
						lookMessage('inversion de commande');
						lastPress = new Date().getTime();
						inverse = inverse ? false : true;
				}
		},
		axeXHead: function() {
				if (!gamepad)
						return 0;
				return gamepad.axes[2] > 0.2 || gamepad.axes[2] < -0.2 ? gamepad.axes[2].toFixed(1) : 0;
		},
		axeYHead: function() {
				if (!gamepad)
						return 0;
				return (gamepad.axes[3] > 0.2 || gamepad.axes[3] < -0.2 ? gamepad.axes[3].toFixed(1) : 0) * (inverse ? 1 : -1);
		},
		axeZFoot: function() {
				if (!gamepad)
						return 0;

				if (gamepad.buttons[12])
						return -5;
				else if (gamepad.buttons[13])
						return 5;

				return (gamepad.axes[1] > 0.2 || gamepad.axes[1] < -0.2 ? gamepad.axes[1].toFixed(1) : 0) * 5;
		},
		axeXFoot: function() {
				if (!gamepad)
						return 0;

				if (gamepad.buttons[14])
						return -5;
				else if (gamepad.buttons[15])
						return 5;


				return (gamepad.axes[0] > 0.2 || gamepad.axes[0] < -0.2 ? gamepad.axes[0].toFixed(1) : 0) * 5;
		},
		buttonA: function() {

				if (!gamepad || !this.press())
						return false;

				if (gamepad.buttons[0]) {
						lastPress = new Date().getTime();
						return true;
				}
				return false;
		},
		buttonX: function() {
				if (!gamepad || !this.press())
						return false;
				if (gamepad.buttons[2]) {
						lastPress = new Date().getTime();
						return true;
				}
				return false;
		},
		buttonB: function() {
				if (!gamepad || !this.press())
						return false;
				if (gamepad.buttons[1]) {
						lastPress = new Date().getTime();
						return true;
				}
				return false;
		},
		buttonY: function() {
				if (!gamepad || !this.press())
						return false;
				if (gamepad.buttons[3]) {
						lastPress = new Date().getTime();
						return true;
				}
				return false;
		},
		buttonJump: function() {
				if (!gamepad || !this.press())
						return false;
				if (gamepad.buttons[11]) {
						lastPress = new Date().getTime();
						return true;
				}
				return false;
		},
		buttonSpeed: function() {
				if (!gamepad)
						return false;
				return gamepad.buttons[6] ? true : false;
		},
		press: function() {
				if (new Date().getTime() - lastPress > 500)
						return true;

				return false;
		}
};