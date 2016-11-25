"use strict";
// import { grammarFG } from './LanguageGenerator';
function GuiController(appModule, stage) {
    appModule.controller('GuiController', ($scope) => {
        $scope.simulating = false;
        $scope.rootXcoord = 0;
        $scope.rootYcoord = 0;
        $scope.rootZcoord = 0;
        $scope.iterationsNum = 5;
        $scope.deltaAngle = 30;
        $scope.axiom = "G";
        $scope.ruleF = "FF";
        $scope.ruleG = "F[+G][-G]FG";
        $scope.stage = stage;
        $scope.generate2D = function () {
            //let lang = grammarFG($scope.axiom,$scope.ruleF,$scope.ruleG, $scope.iterationsNum);
            //stage.interpretLanguage(lang,parseFloat($scope.deltaAngle));
        };
        $scope.simulate = function () {
            stage.simulate();
            $scope.simulating = true;
        };
        $scope.stopSimulate = function () {
            stage.stopSimulation();
            $scope.simulating = false;
        };
    });
}
exports.GuiController = GuiController;
