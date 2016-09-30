"use strict";
const Turtle_1 = require('./Turtle');
class StageController {
    constructor(containerId) {
        this.initialRot = 0;
        this.movementFactor = 100;
        this.sWidth = window.innerWidth;
        this.sHeight = window.innerHeight;
        this.aspect = window.innerWidth / window.innerHeight;
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, this.aspect, 100, 2000);
        this.camera.position.y = 100;
        this.camera.position.z = -600;
        this.camera.rotation.y = Math.PI;
        this.scene.add(new THREE.GridHelper(200, 10, 0xff0000));
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.sWidth, this.sHeight);
        this.renderer.domElement.style.position = "relative";
        this.container.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
        window.addEventListener('resize', (ev) => { this.onWindowResize(ev); }, false);
        let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.addEventListener('change', () => { this.render(); });
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        this.render();
    }
    onWindowResize(event) {
        this.sWidth = window.innerWidth;
        this.sHeight = window.innerHeight;
        this.aspect = this.sWidth / this.sHeight;
        this.renderer.setSize(this.sWidth, this.sHeight);
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.render();
    }
    render() {
        this.renderer.clear();
        this.renderer.setViewport(0, 0, this.sWidth, this.sHeight);
        this.renderer.render(this.scene, this.camera);
    }
    drawRule2D(rule) {
        let turtle = new Turtle_1.Turtle();
        turtle.drawPath(rule, this.scene);
        this.render();
    }
}
exports.StageController = StageController;
