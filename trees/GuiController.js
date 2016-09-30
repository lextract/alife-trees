"use strict";
function GuiController(appModule, stage) {
    appModule.controller('GuiController', ($scope) => {
        $scope.rootXcoord = 0;
        $scope.rootYcoord = 0;
        $scope.rootZcoord = 0;
        $scope.numIterations = 0;
        $scope.angleDelta = 0;
        $scope.rule2D = "F+F+F+F";
        $scope.stage = stage;
        $scope.generate2D = function () {
            //
            console.log("generrrrrrrrrraddddd");
            stage.drawRule2D($scope.rule2D);
        };
    });
}
exports.GuiController = GuiController;
