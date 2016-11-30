"use strict";
const sidePatch = 10;
const maxLevelResources = 100;
const resourceColors = [];
let geometry = new THREE.PlaneGeometry(sidePatch, sidePatch);
//const patches: Patch[] = [];
const patches = new Map();
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
    get position() {
        return this.figure_.position;
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
    releaseResources(nibbleSize) {
        if (this.energy > nibbleSize) {
            this.energy -= nibbleSize;
            return nibbleSize;
        }
        else {
            return this.energy;
        }
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
    static initializeResourceZones(scene) {
        PatchManager.createResourceZone(new THREE.Vector3(300, 0, -300), 200, 50, 2, scene);
        PatchManager.createResourceZone(new THREE.Vector3(-300, 0, 300), 200, 5, 2, scene);
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
                patches.set(PatchManager.patchCoordKey(newPatch.position), newPatch);
                scene.add(newPatch.figure);
            }
        }
    }
    static landCycle() {
        for (let patch of patches.values()) {
            patch.landCycle();
        }
    }
    static patchesInPerimeter(point, radius) {
        let result = [];
        let centerPatch = PatchManager.normalizeCoords(point);
        let distance = radius * sidePatch;
        let left = centerPatch.clone().setX(centerPatch.x - distance);
        let right = centerPatch.clone().setX(centerPatch.x + distance);
        let front = centerPatch.clone().setZ(centerPatch.z - distance);
        let back = centerPatch.clone().setZ(centerPatch.z + distance);
        let pl = patches.get(PatchManager.patchCoordKey(left));
        if (pl)
            result.push(pl);
        let pr = patches.get(PatchManager.patchCoordKey(right));
        if (pr)
            result.push(pr);
        let pf = patches.get(PatchManager.patchCoordKey(front));
        if (pf)
            result.push(pf);
        let pb = patches.get(PatchManager.patchCoordKey(back));
        if (pb)
            result.push(pb);
        return result;
    }
    static normalizeCoords(point) {
        var result = new THREE.Vector3(Math.round(point.x), 0, Math.round(point.x));
        // only right if sidePatch === 10
        let mod = result.x % 10;
        result.x = result.x - mod;
        if (mod > 2)
            result.x = mod > 7 ? result.x + 10 : result.x + 5;
        mod = Math.round(result.z) % 10;
        result.z = result.z - mod;
        if (mod > 2)
            result.z = mod > 7 ? result.z + 10 : result.z + 5;
        return result;
    }
    // static getPatchZone(point: THREE.Vector3, radius: number) {
    //     listadosss.filter(patch => patch.figure.position.distanceTo(point) < radius);
    // }
    static getPatchCoord(point) {
        return patches.get(PatchManager.patchCoordKey(PatchManager.normalizeCoords(point)));
    }
    static patchCoordKey(point) {
        return `x${point.x}y${point.y}z${point.z}`;
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
