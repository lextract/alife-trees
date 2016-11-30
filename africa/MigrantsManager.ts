
import { Zebra } from './Zebra';
import { Tiger } from './Tiger';
import { Patch, PatchManager } from './Patch';

export class ZebrasManager {
    static watchRadius = 100;
    static neighborRadius = 200;
    static maxVelocity = 10;
    static flock: Zebra[] = [];
    static generatePopulation(amount: number, scene: THREE.Scene) {
        for (let i = 0; i < amount; i++) {
            let zebra = new Zebra();
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

    static predatorsCenter(zebra: Zebra): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
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


export class TigersManager {
    static population: Tiger[] = [];
    static maxVelocity = 11;
    static watchRadius = 250;
    static generatePopulation(quantity: number, scene: THREE.Scene) {
        for (let i = 0; i < quantity; i++) {
            let tiger = new Tiger();
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

export class MigrantsManager {
    // static get landResources(): Patch[]{
    //     return PatchManager.patches;
    // }
    static createZebras(quantity: number) {

    }
    static createTigers(quantity: number) {

    }
    static boundPosition(position: THREE.Vector3): THREE.Vector3 {
        let xMin = -500, xMax = 500,
            zMin = -500, zMax = 500;
        let reduction = 10;
        var v: THREE.Vector3 = new THREE.Vector3();
        if (position.x < xMin) v.setX(reduction);
        else if (position.x > xMax) v.setX(-reduction);
        if (position.z < zMin) v.setZ(reduction);
        else if (position.z > zMax) v.setZ(-reduction);

        return v.normalize();
    }
    static randomVector(): THREE.Vector3 {
        let v = new THREE.Vector3(2 * Math.random() - 1, 0, 2 * Math.random() - 1);
        return v.normalize();
    }
}

function getFreePosition(): THREE.Vector3 {
    let p = new THREE.Vector3(500 * Math.random(), 0, 500 * Math.random());
    return p;
}