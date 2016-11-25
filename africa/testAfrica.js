"use strict";
const StageManager_1 = require('./StageManager');
//import { ZebrasManager } from './ZebrasManager';
const GuiController_1 = require('./GuiController');
const Patch_1 = require('./Patch');
const MigrantsManager_1 = require('./MigrantsManager');
let stage;
function initialize() {
    stage = new StageManager_1.StageManager('stageArea');
    let appModule = angular.module('app', []);
    GuiController_1.GuiController(appModule, stage);
    angular.bootstrap(document, ['app']);
    MigrantsManager_1.ZebrasManager.generatePopulation(100, stage.scene);
    MigrantsManager_1.TigersManager.generatePopulation(10, stage.scene);
    Patch_1.PatchManager.createResourceZone(new THREE.Vector3(300, 0, -300), 200, 50, 2, stage.scene);
    // stage.render();
    // rerender();
}
// function rerender() {
//     setTimeout(() => {
//         //ZebrasManager.computeNewPositions();
//         stage.render();
//         rerender();
//     }, 100)
// }
initialize();
