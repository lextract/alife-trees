"use strict";
const MigrantsManager_1 = require('./MigrantsManager');
let geometry = new THREE.BoxGeometry(5, 5, 5);
class Zebra {
    constructor() {
        this.skin = new THREE.MeshBasicMaterial({ color: 0x006699 });
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
            // TODO: restar con el punto inicial
            v.normalize();
            v.multiplyScalar(MigrantsManager_1.ZebrasManager.maxVelocity);
        }
        return v;
    }
    algimentVector() {
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
            // TODO: restar con el vector this.velocidad
            v.normalize();
            v.multiplyScalar(MigrantsManager_1.ZebrasManager.maxVelocity);
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
                let diff = this.position.clone().sub(nearby.position);
                v.add(diff.normalize().divideScalar(d));
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount);
        }
        if (v.length() > 0) {
            v.normalize();
            v.multiplyScalar(MigrantsManager_1.ZebrasManager.maxVelocity);
        }
        return v;
    }
}
exports.Zebra = Zebra;
