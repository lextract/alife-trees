let geometry = new THREE.BoxGeometry(5, 5, 5);
//const population: Tiger[] = [];

export class Tiger {
    private _figure: THREE.Mesh;
    private skin: THREE.MeshBasicMaterial;
    private alimgment: THREE.Vector3;
    constructor() { // pass chromosome
        this.skin = new THREE.MeshBasicMaterial({ color: 0xaa0000 });
        this._figure = new THREE.Mesh(geometry, this.skin);
        this.alimgment = new THREE.Vector3();
    }
    get figure(): THREE.Mesh {
        return this._figure;
    }
    get position(): THREE.Vector3 {
        return this._figure.position;
    }
    set position(p: THREE.Vector3) {
        this._figure.position.set(p.x, p.y, p.z);
    }
    get velocity(): THREE.Vector3 {
        return this.alimgment;
    }
}
