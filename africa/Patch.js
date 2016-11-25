"use strict";
const sidePatch = 10;
const maxLevelResources = 100;
const patches = [];
const resourceColors = [];
let geometry = new THREE.PlaneGeometry(sidePatch, sidePatch);
class Patch {
    constructor(x, y, z) {
        this.energy = 50;
        this.pollution = 0;
        this.energyGrowthRate = 0;
        this.pollutionGrowthRate = 0;
        this.indexColor = 0;
        this.material = new THREE.MeshBasicMaterial({ color: 0x22aa00, side: THREE.DoubleSide });
        this.figure_ = new THREE.Mesh(geometry, this.material);
        this.figure_.position.set(x, y, z);
        this.figure_.rotateX(Math.PI / 2);
    }
    get figure() {
        return this.figure_;
    }
    setResources(value, growthRate) {
        this.energy = Math.round(value);
        this.updateColorState();
        if (typeof growthRate == 'number')
            this.energyGrowthRate = Math.round(growthRate);
    }
    landCycle() {
        if (this.energy < maxLevelResources)
            this.energy += this.energyGrowthRate;
        this.updateColorState();
    }
    updateColorState() {
        let idx = (resourceColors.length - 1) * this.energy / maxLevelResources;
        this.indexColor = Math.round(idx);
        let color = resourceColors[this.indexColor];
        this.material.color.setRGB(color.r, color.g, color.b);
    }
}
exports.Patch = Patch;
class PatchManager {
    static get patches() {
        return patches;
    }
    static createResourceZone(point, radius, alphaResource, growthRate, scene) {
        point.setY(0);
        for (let xi = point.x - radius; xi <= point.x + radius; xi += sidePatch) {
            for (let zi = point.z - radius; zi <= point.z + radius; zi += sidePatch) {
                let mod = Math.round(xi) % 10;
                xi = xi - mod;
                if (mod > 2)
                    xi = mod > 7 ? xi + 10 : xi + 5;
                mod = Math.round(zi) % 10;
                zi = zi - mod;
                if (mod > 2)
                    zi = mod > 7 ? zi + 10 : zi + 5;
                if (point.distanceTo(new THREE.Vector3(xi, 0, zi)) > radius)
                    continue;
                let newPatch = new Patch(xi, 0, zi);
                // TODO: modificar para crear tasa de crecimiento variable, respecto a la distancia del centro
                newPatch.setResources(alphaResource, growthRate);
                patches.push(newPatch);
                scene.add(newPatch.figure);
            }
        }
    }
    static landCycle() {
        for (let i = 0; i < patches.length; i++) {
            patches[i].landCycle();
        }
    }
    static getZone(point, radius) {
        patches.filter(patch => patch.figure.position.distanceTo(point) < radius);
    }
}
exports.PatchManager = PatchManager;
function generateResourceColors() {
    let r = 0;
    let g = 80;
    let b = 0;
    while (g < 256) {
        resourceColors.push(new THREE.Color(r, g / 256, b));
        g += 10;
    }
    g = 255;
    while (r < 230) {
        resourceColors.push(new THREE.Color(r / 256, g / 256, b));
        r += 10;
        g -= 3;
    }
    resourceColors.reverse();
}
generateResourceColors();
