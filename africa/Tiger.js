"use strict";
let geometry = new THREE.BoxGeometry(5, 5, 5);
//const population: Tiger[] = [];
class Tiger {
    constructor() {
        this.skin = new THREE.MeshBasicMaterial({ color: 0xaa0000 });
        this._figure = new THREE.Mesh(geometry, this.skin);
        this.alimgment = new THREE.Vector3();
    }
    get figure() {
        return this._figure;
    }
    get position() {
        return this._figure.position;
    }
    set position(p) {
        this._figure.position.set(p.x, p.y, p.z);
    }
    get velocity() {
        return this.alimgment;
    }
}
exports.Tiger = Tiger;
