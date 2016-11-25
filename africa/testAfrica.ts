import { StageManager } from './StageManager';
//import { ZebrasManager } from './ZebrasManager';
import { GuiController } from './GuiController';
import { PatchManager } from './Patch';
import { ZebrasManager, TigersManager } from './MigrantsManager';

let stage;
function initialize() {
    stage = new StageManager('stageArea');
    let appModule = angular.module('app', []);
    GuiController(appModule, stage);
    angular.bootstrap(document, ['app']);

    ZebrasManager.generatePopulation(100, stage.scene);
    TigersManager.generatePopulation(10, stage.scene);
    PatchManager.createResourceZone(new THREE.Vector3(300, 0, -300), 200,50,2, stage.scene);
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