"use strict";
const TurtleInterpreter_1 = require('./TurtleInterpreter');
class Tree {
    constructor(rootPoint, langGenerator, angle, maxRuleIterations = 4) {
        this.rootPoint = rootPoint;
        this.langGenerator = langGenerator;
        this.angle = angle;
        this.maxRuleIterations = maxRuleIterations;
        this.cyclesCounter = 0;
        this.ruleIterations = 0;
        this.segments = [];
    }
    landCycle(scene) {
        if (this.ruleIterations < this.maxRuleIterations) {
            this.ruleIterations++;
            for (let i = 0; i < this.segments.length; i++)
                scene.remove(this.segments[i]);
            let turtle = new TurtleInterpreter_1.TurtleInterpreter(this.rootPoint.clone());
            turtle.setDeltaAngle(this.angle);
            let lang = this.langGenerator(this.ruleIterations);
            this.segments = turtle.interpret(lang);
            for (let i = 0; i < this.segments.length; i++)
                scene.add(this.segments[i]);
        }
    }
}
exports.Tree = Tree;
