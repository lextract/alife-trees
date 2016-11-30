import { ZebrasManager, TigersManager, MigrantsManager } from './MigrantsManager';
import { PatchManager, Patch } from './Patch';
import { LatticeRD } from './LatticeRD';

let geometry = new THREE.BoxBufferGeometry(8, 10, 8);
let skinGenerator = new LatticeRD(32);
skinGenerator.simulateRD(2000);

export class Chromosome {
    constructor(
        public visionRange = 10,
        public metabolism = 1,
        public nibbleSize = 5,
        public minEnergy = 1,
        public maxEnergy = 100,
        public maxAge = 100,
    ) { }
}

export class Zebra {
    energy = 0;
    private figure_: THREE.Mesh;
    private skin: THREE.MeshBasicMaterial;
    private alimgment: THREE.Vector3;
    constructor(
        public chromosome: Chromosome = new Chromosome()
    ) { // pass chromosome
        skinGenerator.simulateRD(150);
        let texture = new THREE.Texture(skinGenerator.canvas);
        texture.needsUpdate = true;
        this.skin = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); //{ color: 0x006699 });
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
        let coheW = 1, aligW = 1, sepaW = 1, predW = 0;
        let speed = 0.3 * ZebrasManager.maxVelocity;

        let pv = this.predatorsVector();
        let pvNorm = pv.length();
        if (pvNorm > 0) {
            predW = -5;
            coheW = 0.5;
            sepaW = 0.5;
            speed = ZebrasManager.maxVelocity;
            pv.multiplyScalar(predW);
        }
        let target = this.resourceTarget();
        let tv: THREE.Vector3 = new THREE.Vector3();
        if (target) {
            tv = target.position.clone().sub(this.position).normalize();
            if (pvNorm == 0) tv.multiplyScalar(7);
        }
        let cv = this.cohesionVector().multiplyScalar(coheW);
        let sv = this.separationVector().multiplyScalar(sepaW);
        let vv = this.aligmentVector().multiplyScalar(aligW);
        let bv = MigrantsManager.boundPosition(this.position);

        this.velocity.add(cv).add(sv).add(vv).add(pv).add(bv).add(tv).normalize();
        this.position.add(this.velocity.multiplyScalar(speed));
    }
    resourceTarget(): Patch {
        // TODO: resource target not found!
        let patch = PatchManager.getPatchCoord(this.position);
        if (patch && patch.energy > 0) {
            this.energy += patch.releaseResources(this.chromosome.nibbleSize);
            console.log("cebra comiendo...");
            return patch;
        }
        // for (let tent of PatchManager.patches.values()){
        //     let d = this.position.distanceTo(tent.position);
        //     if (d < this.chromosome.visionRange){
        //         if (tent.energy > this.chromosome.metabolism * d / ZebrasManager.maxVelocity) {
        //             patch = tent;
        //         }
        //     }
        // }
        for (let i = 1; i <= this.chromosome.visionRange; i++) {
            let tents = PatchManager.patchesInPerimeter(this.position, i);
            for (let j = 0; j < tents.length; j++) {
                if (tents[j].energy > this.chromosome.metabolism * i) {
                    patch = tents[j];
                }
            }
        }
        return patch;
    }
    cohesionVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < ZebrasManager.flock.length; i++) {
            let nearby = ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < ZebrasManager.neighborRadius) {
                v.add(nearby.position);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount);
            v.sub(this.position);
            v.normalize();
        }
        return v;
    }
    aligmentVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < ZebrasManager.flock.length; i++) {
            let nearby = ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < ZebrasManager.neighborRadius) {
                v.add(nearby.velocity);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount);
            v.normalize();
        }
        return v;
    }
    separationVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < ZebrasManager.flock.length; i++) {
            let nearby = ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < ZebrasManager.neighborRadius / 2) {
                let diff = nearby.position.clone().sub(this.position);
                //v.add(diff.normalize().divideScalar(d));
                v.add(diff);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount).multiplyScalar(-1);
            v.normalize();
        }
        return v;
    }
    predatorsVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < TigersManager.population.length; i++) {
            let tiger = TigersManager.population[i];
            let d = this.position.distanceTo(tiger.position);
            if (d < ZebrasManager.watchRadius) {
                v.add(tiger.position);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount).normalize();
        }
        return v;
    }
}
