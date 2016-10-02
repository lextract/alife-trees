"use strict";
function grammarF(axiom, ruleF, iterations) {
    let prevProduction = axiom;
    for (let i = 0; i < iterations; i++) {
        let nextProduction = "";
        for (let j = 0; j < prevProduction.length; j++) {
            if (prevProduction[j] == "F")
                nextProduction += ruleF;
            else
                nextProduction += prevProduction[j];
        }
        prevProduction = nextProduction;
    }
    return prevProduction;
}
exports.grammarF = grammarF;
function grammarFG(axiom, ruleF, ruleG, iterations) {
    let prevProduction = axiom;
    for (let i = 0; i < iterations; i++) {
        let nextProduction = "";
        for (let j = 0; j < prevProduction.length; j++) {
            if (prevProduction[j] == "F")
                nextProduction += ruleF;
            else if (prevProduction[j] == "G")
                nextProduction += ruleG;
            else
                nextProduction += prevProduction[j];
        }
        prevProduction = nextProduction;
    }
    return prevProduction;
}
exports.grammarFG = grammarFG;
