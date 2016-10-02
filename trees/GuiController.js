"use strict";
const LanguageGenerator_1 = require('./LanguageGenerator');
function GuiController(appModule, stage) {
    appModule.controller('GuiController', ($scope) => {
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
            let lang = LanguageGenerator_1.grammarFG($scope.axiom, $scope.ruleF, $scope.ruleG, $scope.iterationsNum);
            stage.interpretLanguage(lang, parseFloat($scope.deltaAngle));
        };
    });
}
exports.GuiController = GuiController;
