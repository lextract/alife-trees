"use strict";
const MigrantsManager_1 = require('./MigrantsManager');
const LatticeRD_1 = require('./LatticeRD');
let geometry = new THREE.BoxGeometry(8, 15, 8);
let skinGenerator = new LatticeRD_1.LatticeRD(32);
skinGenerator.colorGenerator = colorGeneratorFn;
skinGenerator.simulateRD(1000);
class Tiger {
    constructor() {
        skinGenerator.simulateRD(100);
        let texture = new THREE.Texture(skinGenerator.canvas);
        texture.needsUpdate = true;
        this.skin = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
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
        let speed = 0.3 * MigrantsManager_1.TigersManager.maxVelocity;
        let rdv = new THREE.Vector3();
        let pv = this.preysVector();
        if (pv.length() > 0) {
            speed = MigrantsManager_1.TigersManager.maxVelocity;
        }
        else
            rdv = MigrantsManager_1.MigrantsManager.randomVector();
        let bv = MigrantsManager_1.MigrantsManager.boundPosition(this.position);
        this.velocity.add(rdv).add(pv).add(bv).normalize();
        this.position.add(this.velocity.multiplyScalar(speed));
    }
    preysVector() {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < MigrantsManager_1.ZebrasManager.flock.length; i++) {
            let zebra = MigrantsManager_1.ZebrasManager.flock[i];
            let d = this.position.distanceTo(zebra.position);
            if (d < MigrantsManager_1.TigersManager.watchRadius) {
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
exports.Tiger = Tiger;
function colorGeneratorFn(value) {
    let c = Math.round(255 - 255 * value);
    let c3 = c / 3;
    let result = `rgb(${c},${c3},0)`;
    return result;
}
