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
            let cv = zebra.cohesionVector().multiplyScalar(m1);
            let sv = zebra.separationVector().multiplyScalar(m2);
            let vv = zebra.algimentVector().multiplyScalar(m3);
            let bp = ZebrasManager.boundPosition(zebra);
            let pc = ZebrasManager.predatorsCenter(zebra);
            zebra.velocity.add(cv).add(sv).add(vv).add(bp).add(pc).normalize();
            zebra.position.add(zebra.velocity.multiplyScalar(ZebrasManager.maxVelocity));
        }
    }
    static boundPosition(migrant) {
        let xMin = -500, xMax = 500, zMin = -500, zMax = 500;
        let reduction = 10;
        var v = new THREE.Vector3();
        if (migrant.position.x < xMin)
            v.setX(reduction);
        else if (migrant.position.x > xMax)
            v.setX(-reduction);
        if (migrant.position.z < zMin)
            v.setZ(reduction);
        else if (migrant.position.z > zMax)
            v.setZ(-reduction);
        return v;
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
ZebrasManager.maxVelocity = 5;
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
        let m1 = 1, m2 = 1, m3 = 1;
        // for (let zebra of flock) {
        //     let cv = cohesionVector(zebra).multiplyScalar(m1);
        //     let sv = separationVector(zebra).multiplyScalar(m2);
        //     let vv = velocityVector(zebra).multiplyScalar(m3);
        //     let bp = boundPosition(zebra);
        //     //zebra.velocity.add(cv).add(sv).add(vv).normalize();
        //     zebra.velocity.add(cv).add(sv).add(vv).add(bp);
        //     limitVelocity(zebra);
        //     zebra.position.add(zebra.velocity);
        // }
    }
}
TigersManager.population = [];
exports.TigersManager = TigersManager;
class MigrantsManager {
    static addCubes(scene) {
        for (let i = 0; i < 100; i++) {
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.setX(500 * Math.random());
            cube.position.setZ(500 * Math.random());
            scene.add(cube);
        }
    }
    static createZebras(quantity) {
    }
    static createTigers(quantity) {
    }
}
exports.MigrantsManager = MigrantsManager;
function getFreePosition() {
    let p = new THREE.Vector3(500 * Math.random(), 0, 500 * Math.random());
    return p;
}
class ResourcePoint {
}
