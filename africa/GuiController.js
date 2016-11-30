"use strict";
const Patch_1 = require('./Patch');
const MigrantsManager_1 = require('./MigrantsManager');
const PlantsManager_1 = require('./PlantsManager');
let stageManager;
function GuiController(appModule, stage) {
    stageManager = stage;
    appModule.controller('GuiController', ($scope) => {
        $scope.simulating = false;
        $scope.simulate = function () {
            stage.simulate();
            $scope.simulating = true;
        };
        $scope.stopSimulate = function () {
            stage.stopSimulation();
            $scope.simulating = false;
        };
        $scope.reset = function () {
            resetStage();
        };
    });
}
exports.GuiController = GuiController;
function resetStage() {
    for (let i = stageManager.scene.children.length - 1; i >= 0; i--) {
        stageManager.scene.remove(stageManager.scene.children[i]);
    }
    MigrantsManager_1.ZebrasManager.generatePopulation(30, stageManager.scene);
    MigrantsManager_1.TigersManager.generatePopulation(5, stageManager.scene);
    Patch_1.PatchManager.initializeResourceZones(stageManager.scene);
    PlantsManager_1.PlantsManager.initializeTrees(stageManager.scene);
    stageManager.scene.add(new THREE.GridHelper(500, 10));
    stageManager.render();
}
