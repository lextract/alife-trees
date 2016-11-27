import { TurtleInterpreter } from './TurtleInterpreter';

export class Tree {
    private cyclesCounter = 0;
    private ruleIterations = 0;
    private segments: THREE.Mesh[] = [];
    constructor(
        private rootPoint: THREE.Vector3,
        private langGenerator: (iterations: number) => string,
        private angle: number,
        private maxRuleIterations = 4
    ) { }
    landCycle(scene: THREE.Scene) {
        if (this.ruleIterations < this.maxRuleIterations) {
            this.ruleIterations++;
            for (let i = 0; i < this.segments.length; i++)
                scene.remove(this.segments[i]);
            let turtle = new TurtleInterpreter(this.rootPoint.clone());
            turtle.setDeltaAngle(this.angle);
            let lang = this.langGenerator(this.ruleIterations);
            this.segments = turtle.interpret(lang);
            for (let i = 0; i < this.segments.length; i++)
                scene.add(this.segments[i]);
        }
    }
}
