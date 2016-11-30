import { StageManager } from './StageManager';
import { GuiController } from './GuiController';

let stage;
function initialize() {
    stage = new StageManager('stageArea');
    let appModule = angular.module('app', []);
    GuiController(appModule, stage);
    angular.bootstrap(document, ['app']);
}

initialize();