"use strict";
const convolutionMatrix = [0.05, 0.2, 0.05, 0.2, -1, 0.2, 0.05, 0.2, 0.05];
/**
 * Reaction-Diffusion 2D Lattice, simulate pattern generation
 * based on Gray-Scott algorithm
 */
class LatticeRD {
    constructor(sideSize = 64) {
        this.sideSize = sideSize;
        this.iterations_ = 0;
        this.feedRate_ = 0.017;
        this.killRate_ = 0.037;
        this.difussionRateA_ = 0.753;
        this.difussionRateB_ = 0.097;
        this.canvas_ = document.createElement('canvas');
        this.canvas.width = this.sideSize;
        this.canvas.height = this.sideSize;
        this.canvas.style.width = this.sideSize + 'px';
        this.canvas.style.height = this.sideSize + 'px';
        this.resetStates();
        this.colorGenerator = colorGeneratorFn;
    }
    get canvas() {
        return this.canvas_;
    }
    get difussionRateA() {
        return this.difussionRateA_;
    }
    get difussionRateB() {
        return this.difussionRateB_;
    }
    get feedRate() {
        return this.feedRate_;
    }
    get killRate() {
        return this.killRate_;
    }
    get iterations() {
        return this.iterations_;
    }
    setRates(feedRate, killRate, diffusionRateA, diffusionRateB) {
        if (feedRate && feedRate > 0 && feedRate < 1)
            this.feedRate_ = feedRate;
        if (killRate && killRate > 0 && killRate < 1)
            this.killRate_ = killRate;
        if (diffusionRateA && diffusionRateA > 0 && diffusionRateA < 1)
            this.difussionRateA_ = diffusionRateA;
        if (diffusionRateB && diffusionRateB > 0 && diffusionRateB < 1)
            this.difussionRateB_ = diffusionRateB;
    }
    /**
     * Simulate for N iterations, at the end this call redraw()
     */
    simulateRD(iterations) {
        for (let i = 1; i <= iterations; i++) {
            this.updateStates();
            this.iterations_ += 1;
        }
        this.redraw();
    }
    updateStates() {
        for (let i = 0; i < this.sideSize; i++) {
            for (let j = 0; j < this.sideSize; j++) {
                let spot = this.spots[i][j];
                spot.aConcentration += dAdt(i, j, this);
                spot.bConcentration += dBdt(i, j, this);
            }
        }
    }
    getSpot(x, y) {
        if (x < 0)
            x = this.sideSize - 1;
        if (x >= this.sideSize)
            x = 0;
        if (y < 0)
            y = this.sideSize - 1;
        if (y >= this.sideSize)
            y = 0;
        return this.spots[x][y];
    }
    resetStates() {
        this.spots = [];
        this.iterations_ = 0;
        for (let i = 0; i < this.sideSize; i++) {
            this.spots[i] = [];
            for (let j = 0; j < this.sideSize; j++) {
                //this.spots[i][j] = new SpotRD(1, Math.random() < 0.47 ? 1 : 0, i, j);
                this.spots[i][j] = new SpotRD(1, 0, i, j);
            }
        }
        this.spots[31][31].bConcentration = 1;
    }
    redraw() {
        let ctx = this.canvas.getContext('2d');
        for (let i = 0; i < this.sideSize; i++) {
            for (let j = 0; j < this.sideSize; j++) {
                let spot = this.spots[i][j];
                spot.draw(ctx, this.colorGenerator);
            }
        }
    }
}
exports.LatticeRD = LatticeRD;
class SpotRD {
    constructor(aConcentration, bConcentration, x, y) {
        this.aConcentration = aConcentration;
        this.bConcentration = bConcentration;
        this.x = x;
        this.y = y;
    }
    draw(ctx, colorGenerator) {
        ctx.fillStyle = colorGenerator(this.bConcentration);
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}
function colorGeneratorFn(value) {
    let c = Math.round(255 - 255 * value);
    let result = `rgb(${c},${c},${c})`;
    return result;
}
function dAdt(i, j, rdLattice) {
    let aC = rdLattice.getSpot(i, j).aConcentration;
    let bC = rdLattice.getSpot(i, j).bConcentration;
    let laplacian_aC = 0;
    let cvmIdx = 0;
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            let ac = rdLattice.getSpot(k, l).aConcentration;
            laplacian_aC += ac * convolutionMatrix[cvmIdx];
            cvmIdx++;
        }
    }
    let deltaA = rdLattice.difussionRateA * laplacian_aC
        + rdLattice.feedRate * (1 - aC)
        - aC * bC * bC;
    return deltaA;
}
function dBdt(i, j, rdLattice) {
    let aC = rdLattice.getSpot(i, j).aConcentration;
    let bC = rdLattice.getSpot(i, j).bConcentration;
    let laplacian_bC = 0;
    let cvmIdx = 0;
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            let bc = rdLattice.getSpot(k, l).bConcentration;
            laplacian_bC += bc * convolutionMatrix[cvmIdx];
            cvmIdx++;
        }
    }
    let deltaB = rdLattice.difussionRateB * laplacian_bC
        + aC * bC * bC
        - (rdLattice.killRate + rdLattice.feedRate) * bC;
    return deltaB;
}
