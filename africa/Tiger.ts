import { ZebrasManager, TigersManager, MigrantsManager } from './MigrantsManager';
import { LatticeRD } from './LatticeRD';

let geometry = new THREE.BoxGeometry(8, 15, 8);
let skinGenerator = new LatticeRD(32);
skinGenerator.colorGenerator = colorGeneratorFn;
skinGenerator.simulateRD(1000);

export class Tiger {
    private figure_: THREE.Mesh;
    private skin: THREE.MeshBasicMaterial;
    private alimgment: THREE.Vector3;
    constructor() { // pass chromosome
        skinGenerator.simulateRD(100);
        let texture = new THREE.Texture(skinGenerator.canvas);
        texture.needsUpdate = true;
        this.skin = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        this.figure_ = new THREE.Mesh(geometry, this.skin);
        this.alimgment = new THREE.Vector3();
    }
    get figure(): THREE.Mesh {
        return this.figure_;
    }
    get position(): THREE.Vector3 {
        return this.figure_.position;
    }
    set position(p: THREE.Vector3) {
        this.figure_.position.set(p.x, p.y, p.z);
    }
    get velocity(): THREE.Vector3 {
        return this.alimgment;
    }
    computeNewPosition() {
        let speed = 0.3 * TigersManager.maxVelocity;
        let rdv = new THREE.Vector3();
        let pv = this.preysVector();
        if (pv.length() > 0) {
            speed = TigersManager.maxVelocity;
        }
        else rdv = MigrantsManager.randomVector();
        let bv = MigrantsManager.boundPosition(this.position);
        this.velocity.add(rdv).add(pv).add(bv).normalize();
        this.position.add(this.velocity.multiplyScalar(speed));

    }
    preysVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < ZebrasManager.flock.length; i++) {
            let zebra = ZebrasManager.flock[i];
            let d = this.position.distanceTo(zebra.position);
            if (d < TigersManager.watchRadius) {
                v.add(zebra.position);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount).normalize();
        }
        return v;
    }
}

function colorGeneratorFn(value: number): string | CanvasGradient | CanvasPattern {
    let c = Math.round(255 - 255 * value);
    let c3 = c / 3;
    let result = `rgb(${c},${c3},0)`;
    return result;
}