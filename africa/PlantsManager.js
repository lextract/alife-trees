"use strict";
const Tree_1 = require('../Trees/Tree');
const LanguageGenerator = require('../Trees/LanguageGenerator');
const trees = [];
let cyclesCounter = 0;
let ruleIndex = 0;
let cyclicIndex = 0;
class PlantsManager {
    generateGrass(scene) {
    }
    static initializeTrees(scene) {
        createTreeA(6);
        createTreeA(5);
        createTreeA(3);
        createTreeA(3);
        createTreeA(3);
        createTreeA(5);
        createTreeA(3);
        for (let i = 0; i < trees.length; i++) {
            trees[i].landCycle(scene);
        }
        cyclicIndex++;
    }
    static landCycle(scene) {
        if (cyclesCounter % 32 == 0) {
            trees[cyclicIndex].landCycle(scene);
            cyclicIndex++;
            cyclicIndex = cyclicIndex % trees.length;
        }
        cyclesCounter++;
    }
}
PlantsManager.grassRule = "";
exports.PlantsManager = PlantsManager;
function createTreeA(maxIterations) {
    let axiom = "A";
    let rules = new Map();
    rules.set("A", "[&FL!A]/////’[&FL!A]///////’[&FL!A]");
    rules.set("F", "S ///// F");
    rules.set("S", "FL");
    rules.set("L", "[’’’∧∧{-f+f+f-|-f+f+f}]");
    trees.push(new Tree_1.Tree(new THREE.Vector3(Math.random() * 1000 - 500, 0, Math.random() * 1000 - 500), LanguageGenerator.grammar(axiom, rules), 23, maxIterations));
}
function createTreeB() {
}
