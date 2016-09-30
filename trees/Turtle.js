"use strict";
let STEP_SIZE = 50;
let DELTA = Math.PI / 2;
//let ANGLE = Math.PI/2;
class Turtle {
    constructor() {
        this.lastAngle = 0;
        this.head = new THREE.Vector3(0, 1, 0);
        this.startPosition = new THREE.Vector3(0, 0, 0);
    }
    advance() {
        let figurePosition = this.startPosition.clone();
        figurePosition.add(this.head.clone().multiplyScalar(STEP_SIZE / 2));
        let geometry = new THREE.CylinderGeometry(10, 10, STEP_SIZE, 10);
        let material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        let cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.setX(figurePosition.x);
        cylinder.position.setY(figurePosition.y);
        cylinder.rotation.z = this.lastAngle;
        this.startPosition.add(this.head.clone().multiplyScalar(STEP_SIZE));
        console.log(this.startPosition);
        console.log(this.lastAngle);
        return cylinder;
    }
    rotate(positive) {
        if (positive)
            this.lastAngle += DELTA;
        else
            this.lastAngle -= DELTA;
        this.head.setX(Math.sin(this.lastAngle));
        this.head.setY(Math.cos(this.lastAngle));
    }
    drawPath(path, scene) {
        for (let i = 0; i < path.length; i++) {
            switch (path[i]) {
                case 'F':
                    scene.add(this.advance());
                    break;
                case '+':
                    this.rotate(true);
                    break;
                case '-':
                    this.rotate(false);
                    break;
            }
        }
    }
}
exports.Turtle = Turtle;
