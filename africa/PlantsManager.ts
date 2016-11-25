

export class PlantsManager{
    static grassRule: string = "";
    generateGrass(scene: THREE.Scene){

    }
    generateTree(){

    }
}

class ResourceManager{

    addResources(alpha: number, x: number, y: number, growthRate?: number, pollutionGrowthRate?: number) {
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

