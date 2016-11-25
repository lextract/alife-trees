
import { Zebra } from './Zebra';
import { Tiger } from './Tiger';

export class ZebrasManager {
    static watchRadius = 100;
    static neighborRadius = 200;
    static maxVelocity = 5;
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
            let cv = zebra.cohesionVector().multiplyScalar(m1);
            let sv = zebra.separationVector().multiplyScalar(m2);
            let vv = zebra.algimentVector().multiplyScalar(m3);
            let bp = ZebrasManager.boundPosition(zebra);
            let pc = ZebrasManager.predatorsCenter(zebra);
            zebra.velocity.add(cv).add(sv).add(vv).add(bp).add(pc).normalize();
            zebra.position.add(zebra.velocity.multiplyScalar(ZebrasManager.maxVelocity));
        }
    }

    static boundPosition(migrant: Zebra): THREE.Vector3 {
        let xMin = -500, xMax = 500,
            zMin = -500, zMax = 500;
        let reduction = 10;
        var v: THREE.Vector3 = new THREE.Vector3();
        if (migrant.position.x < xMin) v.setX(reduction);
        else if (migrant.position.x > xMax) v.setX(-reduction);
        if (migrant.position.z < zMin) v.setZ(reduction);
        else if (migrant.position.z > zMax) v.setZ(-reduction);

        return v;
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
        if (neighborCount > 0){
            v.divideScalar(neighborCount).normalize();
            v.multiplyScalar(-2);
        }
        return v;
    }
}


export class TigersManager {
    static population: Tiger[] = [];
    static generatePopulation(quantity: number, scene: THREE.Scene) {
        for (let i = 0; i < quantity; i++) {
            let tiger = new Tiger();
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

export class MigrantsManager {
    static addCubes(scene: THREE.Scene) {
        for (let i = 0; i < 100; i++) {
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.setX(500 * Math.random());
            cube.position.setZ(500 * Math.random());
            scene.add(cube);


        }
    }
    static createZebras(quantity: number) {

    }
    static createTigers(quantity: number) {

    }
}

function getFreePosition(): THREE.Vector3 {
    let p = new THREE.Vector3(500 * Math.random(), 0, 500 * Math.random());
    return p;
}

class ResourcePoint {

}