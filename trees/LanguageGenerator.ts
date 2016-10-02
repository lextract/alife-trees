
export function grammarF(
    axiom: string,
    ruleF: string, 
    iterations: number
): string {
    let prevProduction = axiom;
    for (let i = 0; i < iterations; i++) {
        let nextProduction = "";
        for (let j = 0; j < prevProduction.length; j++) {
            if (prevProduction[j] == "F") nextProduction += ruleF;
            else nextProduction += prevProduction[j];
        }
        prevProduction = nextProduction;
    }
    return prevProduction;
}

export function grammarFG(
    axiom: string,
    ruleF: string, 
    ruleG: string, 
    iterations: number
): string {
    let prevProduction = axiom;
    for (let i = 0; i < iterations; i++) {
        let nextProduction = "";
        for (let j = 0; j < prevProduction.length; j++) {
            if (prevProduction[j] == "F") nextProduction += ruleF;
            else if (prevProduction[j] == "G") nextProduction += ruleG;
            else nextProduction += prevProduction[j];
        }
        prevProduction = nextProduction;
    }
    return prevProduction;
}

