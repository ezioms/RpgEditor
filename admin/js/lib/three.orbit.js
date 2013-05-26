/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / https://github.com/WestLangley
 */

THREE.OrbitControls = function (object, domElement) {

	THREE.EventTarget.call(this);

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.center = new THREE.Object3D();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.movementSpeed = 5;

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1 };
	var state = STATE.NONE;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var moveUp = false;
	var moveDown = false;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function (angle) {

		if (angle === undefined) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function (angle) {

		if (angle === undefined) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function (angle) {

		if (angle === undefined) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function (angle) {

		if (angle === undefined) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function (zoomScale) {

		if (zoomScale === undefined) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function (zoomScale) {

		if (zoomScale === undefined) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.update = function ( centerSphere ) {

		var position = this.object.position;
		var offset = position.clone().subSelf(this.center.position);

		this.center.lookAt(this.object.position);

		if (moveForward) this.center.translateZ(-this.movementSpeed);
		if (moveBackward) this.center.translateZ(this.movementSpeed);

		if (moveLeft)  this.center.translateX(-this.movementSpeed);
		if (moveRight) this.center.translateX(this.movementSpeed);

		if (moveUp)  this.center.translateY(this.movementSpeed);
		if (moveDown) this.center.translateY(-this.movementSpeed);

		centerSphere.position.copy(this.center.position);

		// angle from z-axis around y-axis

		var theta = Math.atan2(offset.x, offset.z);

		// angle from y-axis

		var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

		if (this.autoRotate) {

			this.rotateLeft(getAutoRotationAngle());

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

		offset.x = radius * Math.sin(phi) * Math.sin(theta);
		offset.y = radius * Math.cos(phi);
		offset.z = radius * Math.sin(phi) * Math.cos(theta);

		position.copy(this.center.position).addSelf(offset);

		this.object.lookAt(this.center.position);

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;

		if (lastPosition.distanceTo(this.object.position) > 0) {

			this.dispatchEvent(changeEvent);

			lastPosition.copy(this.object.position);

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow(0.95, scope.userZoomSpeed);

	}

	function onMouseDown(event) {

		if (!scope.userRotate) return;

		event.preventDefault();

		if (event.button === 0 || event.button === 2) {

			state = STATE.ROTATE;

			rotateStart.set(event.clientX, event.clientY);

		} else if (event.button === 1) {

			state = STATE.ZOOM;

			zoomStart.set(event.clientX, event.clientY);

		}

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mouseup', onMouseUp, false);

	}

	function onMouseMove(event) {

		event.preventDefault();

		if (state === STATE.ROTATE) {

			rotateEnd.set(event.clientX, event.clientY);
			rotateDelta.sub(rotateEnd, rotateStart);

			scope.rotateLeft(2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed);
			scope.rotateUp(2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed);

			rotateStart.copy(rotateEnd);

		} else if (state === STATE.ZOOM) {

			zoomEnd.set(event.clientX, event.clientY);
			zoomDelta.sub(zoomEnd, zoomStart);

			if (zoomDelta.y > 0) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy(zoomEnd);

		}

	}

	function onMouseUp(event) {

		if (!scope.userRotate) return;

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mouseup', onMouseUp, false);

		state = STATE.NONE;

	}

	function onMouseWheel(event) {

		if (!scope.userZoom) return;

		if (event.wheelDelta > 0) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}

	function onKeyDown(event) {

		switch (event.keyCode) {

			case 38 :
			case 122 :
			case 119 :
			case 90 :
			case 87 : // Flèche haut, z, w, Z, W
				moveForward = true;
				break;

			case 37 :
			case 113 :
			case 97 :
			case 81 :
			case 65 : // Flèche gauche, q, a, Q, A
				moveLeft = true;
				break;

			case 40 :
			case 115 :
			case 83 : // Flèche bas, s, S
				moveBackward = true;
				break;

			case 39 :
			case 100 :
			case 68 : // Flèche droite, d, D
				moveRight = true;
				break;

			case 82: /*R*/
				moveUp = true;
				break;
			case 70: /*F*/
				moveDown = true;
				break;
		}

	}

	function onKeyUp(event) {
		switch (event.keyCode) {

			case 38 :
			case 122 :
			case 119 :
			case 90 :
			case 87 : // Flèche haut, z, w, Z, W
				moveForward = false;
				break;

			case 37 :
			case 113 :
			case 97 :
			case 81 :
			case 65 : // Flèche gauche, q, a, Q, A
				moveLeft = false;
				break;

			case 40 :
			case 115 :
			case 83 : // Flèche bas, s, S
				moveBackward = false;
				break;

			case 39 :
			case 100 :
			case 68 : // Flèche droite, d, D
				moveRight = false;
				break;

			case 82: /*R*/
				moveUp = false;
				break;
			case 70: /*F*/
				moveDown = false;
				break;
		}


	}

	this.domElement.addEventListener('contextmenu', function (event) {
		event.preventDefault();
	}, false);


	this.domElement.addEventListener('mousedown', onMouseDown, false);
	this.domElement.addEventListener('mousewheel', onMouseWheel, false);
	document.addEventListener('keyup', onKeyUp, false);
	document.addEventListener('keydown', onKeyDown, false);

};