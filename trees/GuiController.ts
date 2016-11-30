import { StageController } from './StageController';
import * as LanguageGenerator from './LanguageGenerator';
import { Tree } from './Tree';

const arboles: Tree[] = [];

export function GuiController(
    appModule: angular.IModule,
    stage: StageController
) {
    appModule.controller('GuiController', ($scope) => {
        $scope.rootXcoord = 0;
        $scope.rootYcoord = 0;
        $scope.rootZcoord = 0;
        $scope.iterationsNum = 5;
        $scope.deltaAngle = 24.3;
        $scope.axiom = "A";
        $scope.maxIterations = 4;
        // $scope.prod1 = "A→B-F+CFC+F-D&F∧D-F+&&CFC+F+B//";
        // $scope.prod2 = "B:A&F∧CFB∧F∧D∧∧-F-D∧|F∧B|FC∧F∧A//";
        // $scope.prod3 = "C→|D∧|F∧B-F+C∧F∧A&&FA&F∧C+F+B∧F∧D//";
        // $scope.prod4 = "D→|CFB-F+B|FA&F∧A&&FB-F+B|FC//";
        $scope.prod1 = "A → [&FL!A]/////’[&FL!A]///////’[&FL!A]";
        $scope.prod2 = "F → S ///// F";
        $scope.prod3 = "S → F L";
        $scope.prod4 = "L → [’’’∧∧{-f+f+f-|-f+f+f}]";
        $scope.prod5 = "";
        $scope.stage = stage;

        $scope.createTree = function () {
            let axiom: string = $scope.axiom;
            let rules: Map<string,string> = new Map();
            let prod1 = LanguageGenerator.extractRule($scope.prod1);
            if (prod1) rules.set(prod1.key, prod1.value);
            let prod2 = LanguageGenerator.extractRule($scope.prod2);
            if (prod2) rules.set(prod2.key, prod2.value);
            let prod3 = LanguageGenerator.extractRule($scope.prod3);
            if (prod3) rules.set(prod3.key, prod3.value);
            let prod4 = LanguageGenerator.extractRule($scope.prod4);
            if (prod4) rules.set(prod4.key, prod4.value);
            let prod5 = LanguageGenerator.extractRule($scope.prod5);
            if (prod5) rules.set(prod5.key, prod5.value);

            arboles.push(new Tree(
                new THREE.Vector3(parseFloat($scope.rootXcoord), parseFloat($scope.rootYcoord), parseFloat($scope.rootZcoord)),
                LanguageGenerator.grammar(axiom,rules),
                parseFloat($scope.deltaAngle),
                parseInt($scope.maxIterations)
            ))
        }
        $scope.landCycle = function () {
            for (let i = 0; i < arboles.length; i++)
                arboles[i].landCycle(stage.scene);
            stage.render();
        }
    });
}
