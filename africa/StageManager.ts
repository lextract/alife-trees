import { TurtleGenerator } from './TurtleGenerator';
import { ZebrasManager } from './MigrantsManager';
import { PatchManager } from './Patch';

export class StageManager {
    simulating = false;
    simulationDelay = 100;
    sWidth: number = window.innerWidth;
    sHeight: number = window.innerHeight;
    aspect = window.innerWidth / window.innerHeight;
    container: HTMLDivElement;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    constructor(containerId: string) {
        this.container = <HTMLDivElement>document.getElementById(containerId);
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
        window.addEventListener('resize', (ev) => { this.onWindowResize(ev) }, false);
        let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.addEventListener('change', () => { this.render() });
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
    interpretLanguage(lang: string, angle: number) {
        let turtle = new TurtleGenerator();
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
    renderStep(){
        ZebrasManager.computeNewPositions();
        PatchManager.landCycle();
        this.render();
    }
}