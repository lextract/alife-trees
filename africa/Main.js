"use strict";
const StageManager_1 = require('./StageManager');
const GuiController_1 = require('./GuiController');
let stage;
function initialize() {
    stage = new StageManager_1.StageManager('stageArea');
    let appModule = angular.module('app', []);
    GuiController_1.GuiController(appModule, stage);
    angular.bootstrap(document, ['app']);
}
initialize();
