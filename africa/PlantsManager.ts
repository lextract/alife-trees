import { Tree } from '../Trees/Tree';
import * as LanguageGenerator  from '../Trees/LanguageGenerator';


const trees: Tree[] = [];
let cyclesCounter = 0;
let ruleIndex = 0;
let cyclicIndex = 0;

export class PlantsManager {
    static grassRule: string = "";

    generateGrass(scene: THREE.Scene) {

    }
    static initializeTrees(scene: THREE.Scene) {
        createTreeA(6);
        createTreeA(5);
        createTreeA(3);
        createTreeA(3);
        createTreeA(3);
        createTreeA(5);
        createTreeA(3);
        for (let i = 0; i < trees.length; i++){
            trees[i].landCycle(scene);
        }
        cyclicIndex++;
    }
    static landCycle(scene: THREE.Scene) {
        if (cyclesCounter % 32 == 0) {
            trees[cyclicIndex].landCycle(scene);
            cyclicIndex++;
            cyclicIndex = cyclicIndex % trees.length;
        }
        cyclesCounter++;
    }

}

function createTreeA(maxIterations) {
    let axiom: string = "A";
    let rules: Map<string, string> = new Map();
    rules.set("A", "[&FL!A]/////’[&FL!A]///////’[&FL!A]");
    rules.set("F", "S ///// F");
    rules.set("S", "FL");
    rules.set("L", "[’’’∧∧{-f+f+f-|-f+f+f}]");

    trees.push(new Tree(
        new THREE.Vector3(Math.random()*1000-500, 0, Math.random()*1000-500),
        LanguageGenerator.grammar(axiom, rules),
        23,
        maxIterations
    ))
}
function createTreeB(){

}