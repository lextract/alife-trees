"use strict";
/**
 * Devuelve una función que genera lenguajes basados en
 * las reglas gramaticales del parametro rule
 */
function grammar(axiom, rules) {
    let langGenerator = (iterations) => {
        let prevProduction = axiom;
        for (let i = 0; i < iterations; i++) {
            let nextProduction = "";
            for (let j = 0; j < prevProduction.length; j++) {
                let rule = rules.get(prevProduction[j]);
                if (rule)
                    nextProduction += rule;
                else
                    nextProduction += prevProduction[j];
            }
            prevProduction = nextProduction;
        }
        return prevProduction;
    };
    return langGenerator;
}
exports.grammar = grammar;
/**
 * Genera un objeto clave-valor busando dentro de
 * la cadena el caracter separador "→" ó ":"
 */
function extractRule(str) {
    let idx = str.indexOf("→");
    if (idx < 0)
        idx = str.indexOf(":");
    if (idx >= 0)
        return {
            key: str.substr(0, idx).trim(),
            value: str.substring(idx + 1).trim()
        };
}
exports.extractRule = extractRule;
