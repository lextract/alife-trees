"use strict";
const MigrantsManager_1 = require('./MigrantsManager');
const Patch_1 = require('./Patch');
const LatticeRD_1 = require('./LatticeRD');
let geometry = new THREE.BoxBufferGeometry(8, 10, 8);
let skinGenerator = new LatticeRD_1.LatticeRD(32);
skinGenerator.simulateRD(2000);
class Chromosome {
    constructor(visionRange = 10, metabolism = 1, nibbleSize = 5, minEnergy = 1, maxEnergy = 100, maxAge = 100) {
        this.visionRange = visionRange;
        this.metabolism = metabolism;
        this.nibbleSize = nibbleSize;
        this.minEnergy = minEnergy;
        this.maxEnergy = maxEnergy;
        this.maxAge = maxAge;
    }
}
exports.Chromosome = Chromosome;
class Zebra {
    constructor(chromosome = new Chromosome()) {
        this.chromosome = chromosome;
        this.energy = 0;
        skinGenerator.simulateRD(150);
        let texture = new THREE.Texture(skinGenerator.canvas);
        texture.needsUpdate = true;
        this.skin = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); //{ color: 0x006699 });
        this.figure_ = new THREE.Mesh(geometry, this.skin);
        this.alimgment = new THREE.Vector3();
    }
    get figure() {
        return this.figure_;
    }
    get position() {
        return this.figure_.position;
    }
    set position(p) {
        this.figure_.position.set(p.x, p.y, p.z);
    }
    get velocity() {
        return this.alimgment;
    }
    computeNewPosition() {
        let coheW = 1, aligW = 1, sepaW = 1, predW = 0;
        let speed = 0.3 * MigrantsManager_1.ZebrasManager.maxVelocity;
        let pv = this.predatorsVector();
        let pvNorm = pv.length();
        if (pvNorm > 0) {
            predW = -5;
            coheW = 0.5;
            sepaW = 0.5;
            speed = MigrantsManager_1.ZebrasManager.maxVelocity;
            pv.multiplyScalar(predW);
        }
        let target = this.resourceTarget();
        let tv = new THREE.Vector3();
        if (target) {
            tv = target.position.clone().sub(this.position).normalize();
            if (pvNorm == 0)
                tv.multiplyScalar(7);
        }
        let cv = this.cohesionVector().multiplyScalar(coheW);
        let sv = this.separationVector().multiplyScalar(sepaW);
        let vv = this.aligmentVector().multiplyScalar(aligW);
        let bv = MigrantsManager_1.MigrantsManager.boundPosition(this.position);
        this.velocity.add(cv).add(sv).add(vv).add(pv).add(bv).add(tv).normalize();
        this.position.add(this.velocity.multiplyScalar(speed));
    }
    resourceTarget() {
        // TODO: resource target not found!
        let patch = Patch_1.PatchManager.getPatchCoord(this.position);
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
            let tents = Patch_1.PatchManager.patchesInPerimeter(this.position, i);
            for (let j = 0; j < tents.length; j++) {
                if (tents[j].energy > this.chromosome.metabolism * i) {
                    patch = tents[j];
                }
            }
        }
        return patch;
    }
    cohesionVector() {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < MigrantsManager_1.ZebrasManager.flock.length; i++) {
            let nearby = MigrantsManager_1.ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < MigrantsManager_1.ZebrasManager.neighborRadius) {
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
    aligmentVector() {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < MigrantsManager_1.ZebrasManager.flock.length; i++) {
            let nearby = MigrantsManager_1.ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < MigrantsManager_1.ZebrasManager.neighborRadius) {
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
    separationVector() {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < MigrantsManager_1.ZebrasManager.flock.length; i++) {
            let nearby = MigrantsManager_1.ZebrasManager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < MigrantsManager_1.ZebrasManager.neighborRadius / 2) {
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
    predatorsVector() {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < MigrantsManager_1.TigersManager.population.length; i++) {
            let tiger = MigrantsManager_1.TigersManager.population[i];
            let d = this.position.distanceTo(tiger.position);
            if (d < MigrantsManager_1.ZebrasManager.watchRadius) {
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
exports.Zebra = Zebra;
