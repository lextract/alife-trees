"use strict";
const StageController_1 = require('./StageController');
const GuiController_1 = require('./GuiController');
function testGenerator() {
    let stage = new StageController_1.StageController('stageArea');
    let appModule = angular.module('app', []);
    GuiController_1.GuiController(appModule, stage);
    angular.bootstrap(document, ['app']);
}
exports.testGenerator = testGenerator;
testGenerator();
