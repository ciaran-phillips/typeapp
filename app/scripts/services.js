'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('typeApp.services', []).
  value('version', '0.1');


var myMod = angular.module('typeApp.services', []);


myMod.factory("scales", function() {
    var scales = [
        {
            "name": "Golden Ratio",
            "value": 1.618
        },
        {
            "name": "Minor Second",
            "value": 1.067
        },
        {
            "name": "Major Second",
            "value": 1.125
        },
        {
            "name": "Minor Third",
            "value": 1.2
        },
        {
            "name": "Major Third",
            "value": 1.25
        },
        {
            "name": "Fourth",
            "value": 1.333
        },
        {
            "name": "Diminished Fifth",
            "value": 1.414
        },
        {
            "name": "Perfect Fifth",
            "value": 1.5
        },
        {
            "name": "Minor Sixth",
            "value": 1.6
        },
        {
            "name": "Major Sixth",
            "value": 1.667
        },
        {
            "name": "Minor Seventh",
            "value": 1.778
        },
        {
            "name":"Major Seventh",
            "value":  1.875
        }
    ];
    return scales;
});

myMod.factory("scaleDistance",[function() {
    function scaleDistanceInstance(){};
    scaleDistanceInstance.prototype.distance = function(fontOne, fontTwo) {};
    scaleDistanceInstance.prototype.setScale = function(fonts) {};
    scaleDistanceInstance.prototype.order = function() {};
    scaleDistanceInstance.prototype.log = function() {};
    
    scaleDistanceInstance.prototype.setScale = function(fonts, scales) {
        this.ratioDistance = {};
        var numScales = scales.length;
        var ratios = [];
        for (var n = 0; n < numScales; n++) {
            
            var dist = this.getScaleDistance(scales[n], fonts);
            ratios.push({
                "id": n,
                "name": scales[n].name,
                "value": scales[n].value,
                "distance": dist
            });
        }
        ratios = this.order(ratios);
        return ratios;
    };
    
    scaleDistanceInstance.prototype.distance = function(scale, fontOne, fontTwo) {
        
        var multiple = this.log(fontOne / fontTwo, scale);
        var dist = (multiple % 1);
        dist = Math.abs(dist);
        if (dist > 0.5) {
            dist = 1 - dist;
        }
        // We don't need to handle floating point errors really accurately, but do need to get rid of them
        // (actually we only need to get rid of them so we can unit test)
        dist = Math.round(dist * 10000) / 10000;
        return dist;
    };
    
    scaleDistanceInstance.prototype.getScaleDistance = function(scale, fonts) {
        
        var arrLength = fonts.length;
        var dist = 0;
        for (var i = 0; i < arrLength; i++) {
            if (!(typeof(fonts[i+1]) == 'undefined')) {
                var dist = dist + this.distance(scale.value, fonts[i], fonts[i+1]);
            }
        }
        return dist;
    };
    
    // We don't want to sort them, just add a numerical position to each as if they were sorted
    scaleDistanceInstance.prototype.order = function(ratios) {
        ratios.sort(function(a,b){
            return a.distance - b.distance;
        });
        // We may be sorting by other things in future, but this order is still important, so add it to the object
        var arrLength = ratios.length;
        for (var i = 0; i < arrLength; i++) {
            ratios[i].order = (i + 1);
        }
        return ratios;
    };
    
    scaleDistanceInstance.prototype.log = function(num, base) {
        return Math.log(num) / Math.log(base);
    };
    
    
    
    return new scaleDistanceInstance();
    
}]);




myMod.factory('scaleGenerator', [function(){
    function fontObjInst() {}
    
    fontObjInst.family = 'Open sans';
    fontObjInst.size = 12;
    fontObjInst.text = "My Default Text";
    fontObjInst.unit = "px";
    
    
    function scaleGen(){}
    
    scaleGen.prototype.getScale = function(ratio, base, top, unit ) {
        var scale = [];
        while ((base / ratio) < top){
            var f = new fontObjInst();
            f.size = base;
            f.unit = unit;
            f.text = "Hello";
            base = base * ratio;
            scale.push(f);
        }
        return scale;
    };
    
    scaleGen.prototype.customScale = function(fonts, unit) {
        var scale = [];
        var arrLength = fonts.length;
        for (var i = 0; i < arrLength; i++) {
            var f = new fontObjInst();
            f.size = fonts[i].value;
            f.unit = unit;
            scale.push(f);
        }
        return scale;
    };
    
    return new scaleGen();
}]);


myMod.factory("typeTable", [function() {
    function typeTab() {}
    typeTab.prototype.setRight = function(scale) {};
    typeTab.prototype.setLeft = function(scale) {};
    
    
    function gridRow() {}
    gridRow.prototype.left;
    gridRow.prototype.right;
    
    typeTab.prototype.newGrid = function(left, right) {
        var grid = this.setRight(right);
        grid = this.setLeft(left, grid);
        return grid;
    };
    
    
    typeTab.prototype.setRight = function(scale) {
        var length = scale.length;
        var grid = [];
        for (var i = 0; i < length; i++) {
            var row = new gridRow();
            row.left = [];
            row.right = scale[i];
            grid.push(row);
        }
        return grid;
    };
    
    typeTab.prototype.setLeft = function(scale, grid) {
        scale.sort(function(a, b) {
            return a.size - b.size;
        });
        var l = scale.length;
        var gridIndex = 1;
        for (var i = 0; i < l; i++) {
            while (grid[gridIndex].right.size < scale[i].size) {
                gridIndex++;
            }
            var right = grid[gridIndex].right.size;
            var prev = grid[gridIndex - 1].right.size;
            if (closerTo(prev, right, scale[i].size)) {
                grid[gridIndex - 1].left.push(scale[i]);
            }
            else {
                grid[gridIndex].left.push(scale[i]);
            }
        }
        return grid;
        
    };
    
    // returns true if needle is closer to a than b
    function closerTo(a, b, needle) {
        var midPoint = (b - ((b - a) / 2));
        return (needle < midPoint);
    }
    
    return new typeTab();
}]);




myMod.factory("transformation",[function() {
    function transformer(){};
    
    // Takes a reference to current grid, and transforms it to match new one
    // Allows us to animate transitions, rather than just replacing the grid
    transformer.prototype.transformGrid = function(oldGrid,newGrid) {
    	
    	this.setTargets(oldGrid, newGrid);
    	
    	this.removeExtra(oldGrid, newGrid);
    	return oldGrid;
    	// Get new position from new grid
    	// Set as target on old grid
    };
    
    transformer.prototype.removeExtra = function(oldGrid, newGrid) {
    	var newLength = newGrid.length;
    	var oldLength = oldGrid.length;
	    if (oldLength > newLength)
		    oldGrid.splice(newLength, Number.MAX_VALUE);
		return oldGrid;
    };
    transformer.prototype.setTargets = function(oldGrid, newGrid) {
    	
    	// We clear the targets for each row, or they can persist between operations (causing weird looking bugs!)
		oldGrid = clearTargets(oldGrid);
    	
    	var gridLength = newGrid.length;
    	// Loop through grid
    	for (var i = 0; i < gridLength; i++) {
    		
    		
    		var target = newGrid[i].right;
    		if (i >= oldGrid.length)
    			oldGrid.push({ left: [], right: null });
    		oldGrid[i].targetRight = target;
    		
    		if (newGrid[i].left.length > 0)
    			oldGrid[i].targetLeft = newGrid[i].left;
    	}
    	console.log('New: ');
    	console.log(newGrid);
    	console.log('Old: ');
    	console.log(oldGrid);
    	return oldGrid;
    };
    transformer.prototype.updateGrid = function(grid) {
    	var l = grid.length;
    	for (var i = 0; i < l; i++) {
    		if (typeof grid[i].targetLeft != "undefined")
	    		grid[i].left = grid[i].targetLeft;
	    	else
	    		grid[i].left.length = 0;
    		grid[i].right = grid[i].targetRight;
    	}
    	return grid;
    };
    
  	function clearTargets(grid){
  		var l = grid.length;
  		for (var i = 0; i < l; i++) {
  			grid[i].targetLeft = [];
  			grid[i].targetRight = {};
  		}
  		return grid;
  	}
    return new transformer();
    
}]);


