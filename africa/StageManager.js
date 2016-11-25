"use strict";
const TurtleGenerator_1 = require('./TurtleGenerator');
const MigrantsManager_1 = require('./MigrantsManager');
const Patch_1 = require('./Patch');
class StageManager {
    constructor(containerId) {
        this.simulating = false;
        this.simulationDelay = 100;
        this.sWidth = window.innerWidth;
        this.sHeight = window.innerHeight;
        this.aspect = window.innerWidth / window.innerHeight;
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 100, 5000);
        this.camera.position.y = 1000;
        this.camera.position.z = -2000;
        this.scene.add(new THREE.GridHelper(500, 10, 0xff0000));
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
    interpretLanguage(lang, angle) {
        let turtle = new TurtleGenerator_1.TurtleGenerator();
        turtle.setDeltaAngle(angle);
        turtle.executeLang(lang, this.scene);
        this.render();
    }
    simulate() {
        this.simulating = true;
        let instance = this;
        function* oneStepFn() {
            while (instance.simulating) {
                instance.renderStep();
                setTimeout(() => {
                    oneStepGenerator.next();
                }, instance.simulationDelay);
                yield;
            }
        }
        let oneStepGenerator = oneStepFn();
        oneStepGenerator.next();
    }
    stopSimulation() {
        this.simulating = false;
    }
    renderStep() {
        MigrantsManager_1.ZebrasManager.computeNewPositions();
        Patch_1.PatchManager.landCycle();
        this.render();
    }
}
exports.StageManager = StageManager;
