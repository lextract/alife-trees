"use strict";
let STEP_SIZE = 10;
const lexems = new Map();
class TurtleInterpreter {
    constructor(startPosition) {
        this.startPosition = startPosition;
        this.fRotation = new THREE.Mesh();
        this.positionsStack = [];
        this.head = new THREE.Vector3(0, 1, 0);
        this.uVector = new THREE.Vector3(0, 0, 1);
        this.lVector = new THREE.Vector3(1, 0, 0);
        this.deltaAngle = Math.PI / 2;
    }
    setDeltaAngle(angle) {
        if (angle > 360)
            angle = angle % 360;
        if (angle < 0)
            angle *= -1;
        if (angle > 2 * Math.PI)
            this.deltaAngle = (angle / 180) * Math.PI;
        else
            this.deltaAngle = angle;
    }
    pushState() {
        let clone = new TurtleInterpreter(this.startPosition.clone());
        clone.head = this.head.clone();
        clone.lVector = this.lVector.clone();
        clone.uVector = this.uVector.clone();
        clone.fRotation = this.fRotation.clone();
        this.positionsStack.push(clone);
    }
    popState() {
        let state = this.positionsStack.pop();
        this.head = state.head;
        this.lVector = state.lVector;
        this.uVector = state.uVector;
        this.startPosition = state.startPosition;
        this.fRotation = state.fRotation;
    }
    advance() {
        let figurePosition = this.startPosition.clone();
        figurePosition.add(this.head.clone().multiplyScalar(STEP_SIZE / 2));
        let geometry = new THREE.CylinderGeometry(1, 1, STEP_SIZE, 10);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(figurePosition.x, figurePosition.y, figurePosition.z);
        cylinder.rotation.copy(this.fRotation.rotation);
        this.startPosition.add(this.head.clone().multiplyScalar(STEP_SIZE));
        return cylinder;
    }
    interpret(lang) {
        let figures = [];
        for (let i = 0; i < lang.length; i++) {
            let lexem = lang[i];
            if (lexem == 'F') {
                figures.push(this.advance());
            }
            else {
                let fn = lexems.get(lexem);
                if (fn)
                    fn(this);
            }
        }
        return figures;
    }
}
exports.TurtleInterpreter = TurtleInterpreter;
lexems.set("f", (turtle) => {
    turtle.startPosition.add(this.head.clone().multiplyScalar(STEP_SIZE));
});
lexems.set("[", (turtle) => {
    turtle.pushState();
});
lexems.set("]", (turtle) => {
    turtle.popState();
});
lexems.set("+", (turtle) => {
    turtle.head.applyAxisAngle(turtle.uVector, turtle.deltaAngle);
    turtle.lVector.applyAxisAngle(turtle.uVector, turtle.deltaAngle);
    turtle.fRotation.rotateOnAxis(turtle.uVector, turtle.deltaAngle);
});
lexems.set("-", (turtle) => {
    turtle.head.applyAxisAngle(turtle.uVector, -turtle.deltaAngle);
    turtle.lVector.applyAxisAngle(turtle.uVector, -turtle.deltaAngle);
    turtle.fRotation.rotateOnAxis(turtle.uVector, -turtle.deltaAngle);
});
lexems.set("&", (turtle) => {
    turtle.head.applyAxisAngle(turtle.lVector, turtle.deltaAngle);
    turtle.uVector.applyAxisAngle(turtle.lVector, turtle.deltaAngle);
    turtle.fRotation.rotateOnAxis(turtle.lVector, turtle.deltaAngle);
});
lexems.set("∧", (turtle) => {
    turtle.head.applyAxisAngle(turtle.lVector, -turtle.deltaAngle);
    turtle.uVector.applyAxisAngle(turtle.lVector, -turtle.deltaAngle);
    turtle.fRotation.rotateOnAxis(turtle.lVector, -turtle.deltaAngle);
});
lexems.set("\\", (turtle) => {
    turtle.uVector.applyAxisAngle(turtle.head, turtle.deltaAngle);
    turtle.lVector.applyAxisAngle(turtle.head, turtle.deltaAngle);
});
lexems.set("/", (turtle) => {
    turtle.uVector.applyAxisAngle(turtle.head, -turtle.deltaAngle);
    turtle.lVector.applyAxisAngle(turtle.head, -turtle.deltaAngle);
});
lexems.set("|", (turtle) => {
    turtle.head.applyAxisAngle(turtle.uVector, Math.PI);
    turtle.lVector.applyAxisAngle(turtle.uVector, Math.PI);
    turtle.fRotation.rotateOnAxis(turtle.uVector, Math.PI);
});
// lexems.set("f", (turtle: TurtleInterpreter) => {
//     turtle
// });
lexems.set("!", () => {
    // TODO: The symbols ! and ' are used to decrement
    //the diameter of segments and increment the current index to the color
    //table, respectively.
});
lexems.set("'", () => {
    // TODO: The symbols ! and ' are used to decrement
    //the diameter of segments and increment the current index to the color
    //table, respectively.
});
