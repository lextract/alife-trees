import { StageManager } from './StageManager';
import { PatchManager } from './Patch';
import { ZebrasManager, TigersManager } from './MigrantsManager';
import { PlantsManager } from './PlantsManager';

let stageManager: StageManager;
export function GuiController(
    appModule: angular.IModule,
    stage: StageManager
) {
    stageManager = stage;
    appModule.controller('GuiController', ($scope) => {
        $scope.simulating = false;
        $scope.simulate = function () {
            stage.simulate();
            $scope.simulating = true;
        }

        $scope.stopSimulate = function () {
            stage.stopSimulation();
            $scope.simulating = false;
        }
        $scope.reset = function () {
            resetStage();
        }

    });
}

function resetStage() {
    for (let i = stageManager.scene.children.length - 1; i >= 0; i--) {
        stageManager.scene.remove(stageManager.scene.children[i]);
    }
    ZebrasManager.generatePopulation(30, stageManager.scene);
    TigersManager.generatePopulation(5, stageManager.scene);
    PatchManager.initializeResourceZones(stageManager.scene);
    PlantsManager.initializeTrees(stageManager.scene);
    stageManager.scene.add(new THREE.GridHelper(500, 10));
    stageManager.render();
}