"use strict";
const Zebra_1 = require('./Zebra');
const Tiger_1 = require('./Tiger');
class ZebrasManager {
    static generatePopulation(amount, scene) {
        for (let i = 0; i < amount; i++) {
            let zebra = new Zebra_1.Zebra();
            zebra.position = getFreePosition();
            ZebrasManager.flock.push(zebra);
            scene.add(zebra.figure);
        }
    }
    static computeNewPositions() {
        let m1 = 1, m2 = 1, m3 = 1;
        for (let i = 0; i < ZebrasManager.flock.length; i++) {
            let zebra = ZebrasManager.flock[i];
            zebra.computeNewPosition();
        }
    }
    static predatorsCenter(zebra) {
        var v = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < TigersManager.population.length; i++) {
            let tiger = TigersManager.population[i];
            let d = zebra.position.distanceTo(tiger.position);
            if (d < ZebrasManager.watchRadius) {
                v.add(tiger.position);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount).normalize();
            v.multiplyScalar(-2);
        }
        return v;
    }
}
ZebrasManager.watchRadius = 100;
ZebrasManager.neighborRadius = 200;
ZebrasManager.maxVelocity = 10;
ZebrasManager.flock = [];
exports.ZebrasManager = ZebrasManager;
class TigersManager {
    static generatePopulation(quantity, scene) {
        for (let i = 0; i < quantity; i++) {
            let tiger = new Tiger_1.Tiger();
            tiger.position = getFreePosition();
            TigersManager.population.push(tiger);
            scene.add(tiger.figure);
        }
    }
    static computeNewPositions() {
        for (let i = 0; i < TigersManager.population.length; i++) {
            TigersManager.population[i].computeNewPosition();
        }
    }
}
TigersManager.population = [];
TigersManager.maxVelocity = 11;
TigersManager.watchRadius = 250;
exports.TigersManager = TigersManager;
class MigrantsManager {
    // static get landResources(): Patch[]{
    //     return PatchManager.patches;
    // }
    static createZebras(quantity) {
    }
    static createTigers(quantity) {
    }
    static boundPosition(position) {
        let xMin = -500, xMax = 500, zMin = -500, zMax = 500;
        let reduction = 10;
        var v = new THREE.Vector3();
        if (position.x < xMin)
            v.setX(reduction);
        else if (position.x > xMax)
            v.setX(-reduction);
        if (position.z < zMin)
            v.setZ(reduction);
        else if (position.z > zMax)
            v.setZ(-reduction);
        return v.normalize();
    }
    static randomVector() {
        let v = new THREE.Vector3(2 * Math.random() - 1, 0, 2 * Math.random() - 1);
        return v.normalize();
    }
}
exports.MigrantsManager = MigrantsManager;
function getFreePosition() {
    let p = new THREE.Vector3(500 * Math.random(), 0, 500 * Math.random());
    return p;
}
