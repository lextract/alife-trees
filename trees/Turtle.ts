let STEP_SIZE = 10;
const zUnitVector = new THREE.Vector3(0, 0, 1);

export class Turtle {
    private head: THREE.Vector3;
    private startPosition: THREE.Vector3;
    private lastAngle = 0;
    private lastRotation: THREE.Euler;
    private positionsStack: Turtle[] = [];
    private deltaAngle: number;
    constructor() {
        this.head = new THREE.Vector3(0, 1, 0);
        this.startPosition = new THREE.Vector3(0, 0, 0);
        this.lastRotation = new THREE.Euler(0, 0, 0);
    }
    setDeltaAngle(angle: number){
        if (angle < 0 || angle > 360) angle = 90;
        if (angle > Math.PI) this.deltaAngle = (angle/180)*Math.PI;
        else this.deltaAngle = angle;
    }
    pushState() {
        let clone = new Turtle();
        clone.head = this.head.clone();
        clone.startPosition = this.startPosition.clone();
        clone.lastRotation = this.lastRotation.clone();
        clone.lastAngle = this.lastAngle;
        this.positionsStack.push(clone);
    }
    popState() {
        let state = this.positionsStack.pop();
        this.head = state.head;
        this.startPosition = state.startPosition;
        this.lastRotation = state.lastRotation;
        this.lastAngle = state.lastAngle;
    }
    advance(): THREE.Mesh {
        let figurePosition = this.startPosition.clone();
        figurePosition.add(this.head.clone().multiplyScalar(STEP_SIZE / 2));

        let geometry = new THREE.CylinderGeometry(1, 1, STEP_SIZE, 10);
        let material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        let cylinder = new THREE.Mesh(geometry, material);

        cylinder.position.setX(figurePosition.x);
        cylinder.position.setY(figurePosition.y);
        cylinder.rotation.z = this.lastRotation.z;
        this.startPosition.add(this.head.clone().multiplyScalar(STEP_SIZE));
        return cylinder;
    }
    rotate(positive: boolean) {
        if (positive) this.lastAngle = this.deltaAngle;
        else this.lastAngle = -this.deltaAngle;
        this.lastRotation.z += this.lastAngle;
        if (positive) this.head.applyAxisAngle(zUnitVector, this.deltaAngle);
        else this.head.applyAxisAngle(zUnitVector, -this.deltaAngle);
    }
    executeLang(lang: string, scene: THREE.Scene) {
        for (let i = 0; i < lang.length; i++) {
            let command = lang[i];
            if (command == 'F' || command == 'G' || command == 'H') {
                scene.add(this.advance());
            }
            else if (command == '[') {
                this.pushState();
            }
            else if (command == ']') {
                this.popState();
            }
            else if (command == '+') {
                this.rotate(true);
            }
            else if (command == '-') {
                this.rotate(false);
            }
        }
    }

    matrixRU(delta: number) {
        let m = new THREE.Matrix3();
        m.set(
            Math.cos(delta), Math.sin(delta), 0,
            -Math.sin(delta), Math.cos(delta), 0,
            0, 0, 1
        );
        return m;
    }
    matrixRL(delta: number) {
        let m = new THREE.Matrix3();
        m.set(
            Math.cos(delta), 0, -Math.sin(delta),
            0, 1, 0,
            Math.sin(delta), 0, Math.cos(delta)
        );
        return m;
    }
    matrixRH(delta: number) {
        let m = new THREE.Matrix3();
        m.set(
            1, 0, 0,
            0, Math.cos(delta), -Math.sin(delta),
            0, Math.sin(delta), Math.cos(delta)
        );
        return m;
    }

}