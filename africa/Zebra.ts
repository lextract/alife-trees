import { ZebrasManager as manager } from './MigrantsManager';

let geometry = new THREE.BoxGeometry(5, 5, 5);

export class Zebra {
    private figure_: THREE.Mesh;
    private skin: THREE.MeshBasicMaterial;
    private alimgment: THREE.Vector3;
    constructor() { // pass chromosome
        this.skin = new THREE.MeshBasicMaterial({ color: 0x006699 });
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
    cohesionVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < manager.flock.length; i++) {
            let nearby = manager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < manager.neighborRadius) {
                v.add(nearby.position);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount);
            v.sub(this.position);
            // TODO: restar con el punto inicial
            v.normalize();
            v.multiplyScalar(manager.maxVelocity)
        }
        return v;
    }
    algimentVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < manager.flock.length; i++) {
            let nearby = manager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < manager.neighborRadius) {
                v.add(nearby.velocity);
                neighborCount++;
            }
        }
        if (neighborCount > 0) {
            v.divideScalar(neighborCount);
            // TODO: restar con el vector this.velocidad
            v.normalize();
            v.multiplyScalar(manager.maxVelocity)
        }
        return v;
    }
    separationVector(): THREE.Vector3 {
        var v: THREE.Vector3 = new THREE.Vector3();
        var neighborCount = 0;
        for (let i = 0; i < manager.flock.length; i++) {
            let nearby = manager.flock[i];
            let d = this.position.distanceTo(nearby.position);
            if (d > 0 && d < manager.neighborRadius / 2) {
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
            v.multiplyScalar(manager.maxVelocity)
            // TODO: restar con el punto inicial, y limitar
        }
        return v;
    }
}
