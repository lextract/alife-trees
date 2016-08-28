var THREE = window['THREE'];
var TreesGen = (function () {
    function TreesGen(containerId) {
        this.container = document.getElementById(containerId);
        this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 4000);
        this.camera.position.z = 2750;
        this.scene = new THREE.Scene();
        window['scene'] = this.scene;
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize, false);
    }
    TreesGen.prototype.appendTree = function (x, y, z) {
        //var geometry = new THREE.BufferGeometry();
        // let positions = [];
        // positions.push(x, y, z);
        // positions.push(x, y + 300, z);
        var arbol = new TreeConfig1(x, y, z);
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(arbol.positions), 3));
        var mesh = new THREE.LineSegments(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        this.scene.add(mesh);
        this.doRender();
    };
    TreesGen.prototype.generateTree = function () {
    };
    TreesGen.prototype.doRender = function () {
        this.renderer.render(this.scene, this.camera);
    };
    TreesGen.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    return TreesGen;
}());
var TreeConfig1 = (function () {
    function TreeConfig1(x, y, z) {
        this.leftAngle = Math.PI * 45;
        this.rightAngle = -Math.PI * 45;
        this.positions = [];
        this.axis = new THREE.Vector3(0, 1, 0);
        this.angle = Math.PI / 6;
        this.rootCoord = new THREE.Vector3(x, y, z);
        this.addVertex(this.rootCoord);
        this.addVertex(this.rootCoord.setY(y + 200));
        this.addVertex(this.rootCoord.setY(y + 200));
        this.appendBranches(this.rootCoord, 5);
        //this.rootCoord.clone().applyAxisAngle(this.axis, this.angle)
        //
        // let leftBranch = this.rootCoord.clone();
        // leftBranch = leftBranch.applyAxisAngle(this.axis, this.angle);
        // leftBranch = leftBranch.add(leftBranch);
        // //this.addVertex(new THREE.Vector3(100, 100, 0));
        // this.addVertex(leftBranch);
    }
    TreeConfig1.prototype.appendBranches = function (v, depth) {
        if (depth <= 0)
            return;
        var leftBranch = v.clone();
        //leftBranch.applyAxisAngle(this.axis, this.angle);
        var xp = v.x * Math.cos(this.angle) - v.y * Math.sin(this.angle);
        var yp = v.x * Math.sin(this.angle) + v.y * Math.cos(this.angle);
        leftBranch.setX(xp);
        leftBranch.setY(yp);
        leftBranch.add(v);
        this.addVertex(v);
        this.addVertex(leftBranch);
        this.appendBranches(leftBranch, depth - 1);
        var rightBranch = v.clone();
        var xpp = v.x * Math.cos(this.angle) + v.y * Math.sin(this.angle);
        var ypp = -v.x * Math.sin(this.angle) + v.y * Math.cos(this.angle);
        leftBranch.setX(xpp);
        leftBranch.setY(ypp);
        // rightBranch.applyAxisAngle(this.axis, -this.angle);
        rightBranch.add(v);
        this.addVertex(v);
        this.addVertex(rightBranch);
        this.appendBranches(rightBranch, depth - 1);
    };
    TreeConfig1.prototype.addVertex = function (v) {
        this.positions.push(v.x, v.y, v.z);
    };
    return TreeConfig1;
}());
