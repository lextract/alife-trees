import {StageController} from './StageController';
import {GuiController} from './GuiController';

export function testGenerator(){
    let stage = new StageController('stageArea');
    let appModule = angular.module('app', []);
    GuiController(appModule,stage);
    angular.bootstrap(document, ['app']);
}

testGenerator();