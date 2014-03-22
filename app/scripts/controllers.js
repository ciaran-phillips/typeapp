'use strict';

/* Controllers */

angular.module('typeApp.controllers', ['ngAnimate']).
  controller('IndexController', ['$scope','$http','scaleDistance','scales','scaleGenerator','typeTable','transformation',
                                    function($scope, $http, scaleDistance, scales, scaleGenerator, typeTable, transformer) {
        var UNIT_PIXEL = 0;
        var UNIT_EM = 1;
        var UNIT_PERCENT = 2;
        
        $http.get('data/scales.json').success(function(data) {
            $scope.scales = data;
        });
        
        // Always in pixels, even if we're using other units
        if (typeof $scope.baseSize == 'undefined') {
            $scope.baseSize = 12;
            $scope.baseUnit = UNIT_PIXEL;
            $scope.scaleType = 0;
            $scope.scale = 1.2;
            $scope.showExtra = true;
            $scope.text = "There's a grand stretch in the evenings";
        }
        
        $scope.unitOptions = [
            {
                "name": "Pixels",
                "value": UNIT_PIXEL
            },
            {
                "name": "Ems",
                "value": UNIT_EM
            },
            {
                "name": "Percent",
                "value": UNIT_PERCENT
            }
        ];
        $scope.fonts = [{"value": 1},{"value": 1.2},{"value": 1.8},{"value": 2},{"value": 2.5},{"value": 4}];
    
        var ratios = scaleDistance.setScale($scope.fonts, scales);
        
        $scope.updateGrid = function() {
            $scope.fonts.sort(function(a,b){
                return a.value - b.value;
            });
            var num = $scope.fonts.length;
            var max = $scope.fonts[num - 1].value;
            
            var min = $scope.fonts[0].value;
            var modScale = scaleGenerator.getScale($scope.scale,min,max,"em");
            $scope.customScale = scaleGenerator.customScale($scope.fonts,"em");
            
            var newGrid = typeTable.newGrid($scope.customScale, modScale);
            if (typeof $scope.grid != "undefined") {
            	transformer.transformGrid($scope.grid, newGrid);
            	transformer.updateGrid($scope.grid);
            } else {
		        $scope.grid = newGrid;
            }
        	
            
        };
        $scope.isScale = function(value) {
            return value == $scope.scale;
        };
        $scope.updateScale = function (scale) {
            $scope.scale = scale;
            $scope.updateGrid();
            
        };
        $scope.isExtra = function (row) {
            return row.left.length == 0;
        };
        $scope.updateGrid();
        
        $scope.ratioDistance = ratios;
        
  }])
  .controller('MyCtrl2', [function() {

  }]);