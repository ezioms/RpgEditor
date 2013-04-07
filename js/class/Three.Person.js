THREE.Person = function (type, picture, name) {

    THREE.Object3D.call(this);

    this.wireframe = false;

    this.text = false;

    this.name = type;

    this.bodyGroup = new THREE.Object3D();

    this.faceMesh = new THREE.MeshFaceMaterial();

    this.listImg = {};


    /*
     * Update person et position
     */
    this.update = function (type) {
        this.initialGesture();

        switch (type) {
            case 1 :
                this.run();
                break;
            case 3 :
                this.happy();
                break;
            case 4 :
                this.guard();
                break;
            case 5 :
                this.stop();
                break;
            default :
                this.walk();
                break;
        }
    };


    /*
     * Load texture
     */
    this.loadTexture = function (x, y, xSize, ySize) {
        var path = x + '-' + y + '-' + xSize + '-' + ySize;

        if (this.listImg[path] !== undefined)
            return this.listImg[path];

        var canvas = window.document.createElement('canvas');
        canvas.width = xSize * 4;
        canvas.height = ySize * 4;

        var context = canvas.getContext('2d');

        context.drawImage(picture, x * 4, y * 4, xSize * 4, ySize * 4, 0, 0, xSize * 4, ySize * 4);

        var texture = new THREE.Texture(canvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
        texture.needsUpdate = true;

        return this.listImg[path] = new THREE.MeshLambertMaterial({
            map: texture,
            wireframe: this.wireframe,
            transparent: true
        });
    };


    /*
     * Initialisation position person
     */
    this.initialGesture = function () {
        this.rightarm.rotation.set(0, 0, 0);
        this.leftarm.rotation.set(0, 0, 0);
        this.rightleg.rotation.set(0, 0, 0);
        this.leftleg.rotation.set(0, 0, 0);
    };


    /*
     * Position person GUARD
     */
    this.guard = function () {
        this.rightarm.rotation.z = 2;
        this.rightarm.rotation.x = 0.2;
    };


    /*
     * Position person STOP
     */
    this.stop = function () {
        this.rightarm.rotation.x = -0.2;
        this.leftarm.rotation.x = 0.2;

        this.rightleg.rotation.x = -0.1;
        this.leftleg.rotation.x = 0.1;
    };


    /*
     * Position person MARCHER
     */
    this.walk = function () {
        var time = Date.now() / 1000;
        var speed = 4;
        var z = 0.6662 * time * 10;
        var x = 0.2812 * time * 10;

        this.head.rotation.y = this.headAccessory.rotation.y = Math.sin(time * 1.5) / 5;
        this.head.rotation.z = this.headAccessory.rotation.z = Math.sin(time) / 5;

        this.leftarm.rotation.z = -Math.sin(time * speed) / 2;
        this.leftarm.rotation.x = (Math.cos(time * speed) + Math.PI / 2) / 30;

        this.rightarm.rotation.z = Math.sin(time * speed) / 2;
        this.rightarm.rotation.x = -(Math.cos(time * speed) + Math.PI / 2) / 30;

        this.leftleg.rotation.z = Math.sin(time * speed) / 3;
        this.rightleg.rotation.z = -Math.sin(time * speed) / 3;
    };


    /*
     * Position person RUN
     */
    this.run = function () {
        var time = Date.now() / 1000;
        var z = 0.6662 * time * 10;
        var x = 0.2812 * time * 10;

        this.head.rotation.y = this.headAccessory.rotation.y = Math.sin(time * 1.5) / 5;
        this.head.rotation.z = this.headAccessory.rotation.z = Math.sin(time) / 5;

        this.rightarm.rotation.z = 2 * Math.cos(z + Math.PI);
        this.rightarm.rotation.x = 1 * (Math.cos(x) - 1);

        this.leftarm.rotation.z = 2 * Math.cos(z);
        this.leftarm.rotation.x = 1 * (Math.cos(x) + 1);

        this.rightleg.rotation.z = 1.4 * Math.cos(z);
        this.leftleg.rotation.z = 1.4 * Math.cos(z + Math.PI);
    };


    /*
     * Position person HAPPY
     */
    this.happy = function () {
        this.rightarm.rotation.z = 2.5;
        this.leftarm.rotation.z = 2.5;

        this.rightarm.rotation.x = 1;
        this.leftarm.rotation.x = -1;

        this.leftleg.rotation.x = 0.1;
        this.rightleg.rotation.x = -0.1;
    };


    /*
     * Contructor person
     */
    var i = 0;

    //Head
    this.materialHeadAccessory = [
        this.loadTexture(10, 2, 2, 2),
        this.loadTexture(10, 0, 2, 2),
        this.loadTexture(10, 0, 2, 2),
        this.loadTexture(12, 0, 2, 2),
        this.loadTexture(8, 2, 2, 2),
        this.loadTexture(12, 2, 2, 2)
    ];
    this.headAccessory = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10, 0, 0, 0, this.materialHeadAccessory), this.faceMesh);
    this.headAccessory.receiveShadow = true;
    this.headAccessory.castShadow = true;
    this.headAccessory.position.x = -1;
    this.headAccessory.position.y = 18;

    //Head
    this.materialHead = [
        this.loadTexture(2, 2, 2, 2),
        this.loadTexture(2, 0, 2, 2),
        this.loadTexture(2, 0, 2, 2),
        this.loadTexture(4, 0, 2, 2),
        this.loadTexture(0, 2, 2, 2),
        this.loadTexture(4, 2, 2, 2)
    ];
    this.head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8, 0, 0, 0, this.materialHead), this.faceMesh);
    this.head.receiveShadow = true;
    this.head.castShadow = true;
    this.head.position.y = 18;


    // Left / Right arm
    this.materialArm = [
        this.loadTexture(11, 4, 1, 4),
        this.loadTexture(11, 4, 1, 4),
        this.loadTexture(11, 4, 1, 1),
        this.loadTexture(12, 4, 1, 1),
        this.loadTexture(11, 4, 1, 4),
        this.loadTexture(11, 4, 1, 4)
    ];


    var tarm = new THREE.CubeGeometry(4, 12, 4, 0, 0, 0, this.materialArm)
    for (i = 0; i < 8; i += 1)
        tarm.vertices[i].y -= 6;

    this.leftarm = new THREE.Mesh(tarm, this.faceMesh);
    this.rightarm = new THREE.Mesh(tarm, this.faceMesh);
    this.leftarm.position.z = -6;
    this.rightarm.position.z = 6;
    this.leftarm.position.y = 14;
    this.rightarm.position.y = 14;

    this.leftarm.receiveShadow = true;
    this.leftarm.castShadow = true;
    this.rightarm.receiveShadow = true;
    this.rightarm.castShadow = true;

    this.bodyGroup.add(this.leftarm);
    this.bodyGroup.add(this.rightarm);


    // Body
    this.materialBody = [
        this.loadTexture(5, 5, 2, 3),
        this.loadTexture(8, 5, 2, 3),
        this.loadTexture(5, 4, 2, 1),
        this.loadTexture(7, 4, 2, 1),
        this.loadTexture(4, 5, 1, 3),
        this.loadTexture(7, 5, 1, 3)
    ];

    this.body = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 8, 0, 0, 0, this.materialBody), this.faceMesh);
    this.body.position.y = 8;
    this.body.receiveShadow = true;
    this.body.castShadow = true;
    this.bodyGroup.add(this.body);


    // Left / Right leg
    this.materialLeg = [
        this.loadTexture(0, 5, 1, 3),
        this.loadTexture(2, 5, 1, 3),
        this.loadTexture(1, 4, 1, 1),
        this.loadTexture(2, 4, 1, 1),
        this.loadTexture(3, 5, 1, 3),
        this.loadTexture(1, 5, 1, 3)
    ];


    var leg = new THREE.CubeGeometry(4, 12, 4, 0, 0, 0, this.materialLeg)
    for (i = 0; i < 8; i += 1)
        leg.vertices[i].y -= 6;
    this.leftleg = new THREE.Mesh(leg, this.faceMesh);
    this.rightleg = new THREE.Mesh(leg, this.faceMesh);
    this.leftleg.position.z = -2;
    this.rightleg.position.z = 2;
    this.leftleg.position.y = 2;
    this.rightleg.position.y = 2;
    this.leftleg.receiveShadow = true;
    this.leftleg.castShadow = true;
    this.rightleg.receiveShadow = true;
    this.rightleg.castShadow = true;

    this.bodyGroup.add(this.leftleg);
    this.bodyGroup.add(this.rightleg);

    this.head.position.x = -2;
    this.bodyGroup.position.x = -2;

    this.add(this.bodyGroup);
    this.add(this.head);
    this.add(this.headAccessory);

    this.rotation.y = 270 * Math.PI / 180;

    this.scale.x = 2.5;
    this.scale.y = 2.5;
    this.scale.z = 2.5;

    if (name) {
        var text3d = new THREE.TextGeometry(name, {
            size: 2,
            height: 0.5,
            font: "helvetiker"
        });

        text3d.computeBoundingBox();

        this.text = new THREE.Mesh(text3d, new THREE.MeshBasicMaterial({
            color: 0xffffff,
            overdraw: true,
            wireframe: this.wireframe
        }));

        this.text.position.z = ( text3d.boundingBox.max.x - text3d.boundingBox.min.x ) / 2;
        this.text.position.y = 23;

        this.text.rotation.y = 90 * Math.PI / 180;

        this.text.doubleSided = false;

        this.add(this.text);
    }
};

THREE.Person.prototype = Object.create(THREE.Object3D.prototype);