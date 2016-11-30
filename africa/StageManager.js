"use strict";
const MigrantsManager_1 = require('./MigrantsManager');
const Patch_1 = require('./Patch');
const PlantsManager_1 = require('./PlantsManager');
class StageManager {
    constructor(containerId) {
        this.simulating = false;
        this.simulationDelay = 100;
        this.sWidth = window.innerWidth;
        this.sHeight = window.innerHeight;
        this.aspect = window.innerWidth / window.innerHeight;
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 50, 5000);
        //let frustumSize = 600;
        // this.camera = new THREE.OrthographicCamera( 0.5 * frustumSize * this.aspect / - 2, 0.5 * frustumSize * this.aspect / 2, 
        // frustumSize / 2, frustumSize / - 2, 150, 1000 );
        this.camera.position.y = 1000;
        this.camera.position.z = -2000;
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
    }
    onWindowResize(event) {
        this.sWidth = window.innerWidth;
        this.sHeight = window.innerHeight;
        this.aspect = this.sWidth / this.sHeight;
        this.renderer.setSize(this.sWidth, this.sHeight);
        //this.camera.aspect = 0.5 * this.aspect;
        // cameraOrtho.left   = - 0.5 * frustumSize * aspect / 2;
        // 		cameraOrtho.right  =   0.5 * frustumSize * aspect / 2;
        this.camera.updateProjectionMatrix();
        this.render();
    }
    render() {
        this.renderer.clear();
        this.renderer.setViewport(0, 0, this.sWidth, this.sHeight);
        this.renderer.render(this.scene, this.camera);
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
        Patch_1.PatchManager.landCycle();
        MigrantsManager_1.ZebrasManager.computeNewPositions();
        MigrantsManager_1.TigersManager.computeNewPositions();
        PlantsManager_1.PlantsManager.landCycle(this.scene);
        this.render();
    }
}
exports.StageManager = StageManager;
