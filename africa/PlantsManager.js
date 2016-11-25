"use strict";
class PlantsManager {
    generateGrass(scene) {
    }
    generateTree() {
    }
}
PlantsManager.grassRule = "";
exports.PlantsManager = PlantsManager;
class ResourceManager {
    addResources(alpha, x, y, growthRate, pollutionGrowthRate) {
        // let x1 = x - alphaFactors.length + 1;
        // let x2 = x + alphaFactors.length - 1;
        // let y1 = y - alphaFactors.length + 1;
        // let y2 = y + alphaFactors.length - 1;
        // for (let i = x1; i <= x2; i++) {
        //     let dx = Math.abs(x - i);
        //     for (let j = y1; j <= y2; j++) {
        //         let dy = Math.abs(y - j);
        //         let energy = dx > dy ? alphaFactors[dx] * alpha : alphaFactors[dy] * alpha;
        //         let plot = this.getPlot(i, j);
        //         plot.setResources(energy, growthRate, pollutionGrowthRate);
        //     }
        // }
    }
}
