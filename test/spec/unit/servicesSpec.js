'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('typeApp.services'));

  
  
    // getScaleDistance Minor Third, 1.2
    
    describe('scaleDistance', function() {
        it('should get correct distance', inject(function(scaleDistance){
            
            var fontOne = 10;
            var fontTwo = 14.4;
            var dist = scaleDistance.distance(1.2, fontOne, fontTwo);
            
            expect(dist).toEqual(0);
            var fontOne = 12;
            var fontTwo = 22.5;
            var dist = scaleDistance.distance(1.5, fontOne, fontTwo);
            expect(dist).toEqual(0.4497);
        }));
        
        
    });
    
    describe('scaleGenerator', function() {
      it('should create a mod scale of correct ratio', inject(function(scaleGenerator){
        var scale = scaleGenerator.getScale(1.2, 12, 28, "px");
        expect(scale[0].size).toEqual(12);
        expect(scale[1].size).toBeCloseTo(14.4);
      }));
      
      it('should add unit to font objects',inject(function(scaleGenerator){
        var scale = scaleGenerator.getScale(1.2,12,28,"em");
        expect(scale[0].unit).toEqual("em");
        var scale = scaleGenerator.getScale(1.2,12,28,"px");
        expect(scale[0].unit).toEqual("px");
      }));
      
      it('should have one font size higher than the given top value', inject(function(scaleGenerator){
        var topValue = 28;
        var scale = scaleGenerator.getScale(1.2,12,topValue,"em");
        var length = scale.length;
        var last = scale[length - 1].size;
        var secondLast = scale[length - 2].size;
        expect(last).toBeGreaterThan(topValue);
        expect(secondLast).toBeLessThan(topValue);
      }));
    });
    describe('typeTable', function() {
      
      it('should set right scale values in grid object',inject(function(typeTable){
        var scale = [10,12,14];
        var g = typeTable.setRight(scale);
        expect(g[0].right).toEqual(10);
        expect(g[1].right).toEqual(12);
        expect(g[2].right).toEqual(14);
      }));
      
      it('should set left scale values to closest matching grid rows', inject(function(typeTable){
        var scale = [{"size":13},{"size":18},{"size":21},{"size":28}];
        var customScale = [{"size":12},{"size":17},{"size":23},{"size":24},{"size":25}];
        var g = typeTable.setRight(scale);
        var g = typeTable.setLeft(customScale, g);
        expect(g[0].left.length).toEqual(1);
        expect(g[0].left[0].size).toEqual(12);
        expect(g[2].left.length).toEqual(2);
        expect(g[3].left.length).toEqual(1);
      }));
      
    });
    
    
    describe('transformation', function() {
    	var oldGrid = [{ 
    			right: { size: 12 },
    			left: [{ size: 13 }]
    		}, {
    			right: { size: 14.4 },
    			left: [{ size: 16 }, {size: 16.2}]
    		}, {
    			right: { size: 17.28 },
    			left: [{ size: 19 }]
    		},
    	];
    	var longOldGrid = [{ 
			right: { size: 12 },
			left: [{ size: 13 }]
		}, {
			right: { size: 14.4 },
			left: [{ size: 16 }, {size: 16.2}]
		}, {
			right: { size: 17.28 },
			left: [{ size: 19 }]
		},{
			right: { size: 22 },
			left: [{ size: 23 }]
		},{
			right: { size: 25 },
			left: [{ size: 26 }]
		}];
    	var newGrid = [{ 
			right: { size: 13 },
			left: [{ size: 14 }]
		}, {
			right: { size: 15 },
			left: [{ size: 16 }]
		}, {
			right: { size: 18 },
			left: [{ size: 18 }, {size: 19}]
		},{
			right: { size: 21 },
			left: [{ size: 22 }, {size: 23}]
		}];
    	it('should set correct targets given a new and old grid',inject(function(transformation) {
    		
    		oldGrid = transformation.setTargets(oldGrid, newGrid);
    		expect(oldGrid[1].targetRight).toEqual({ size: 15 });
    		expect(oldGrid[2].targetRight).toEqual({ size: 18 });
    		expect(oldGrid[2].targetLeft).toEqual([{ size: 18 },{size: 19}]);
    		
    	}));
    	
    	it('should lengthen the grid if needed',inject(function(transformation) {
    		oldGrid = transformation.setTargets(oldGrid, newGrid);
    		expect(oldGrid.length).toEqual(4);
    		expect(oldGrid[3].targetLeft).toEqual([{ size: 22 }, {size: 23}]);
    		expect(oldGrid[3].left).not.toBe(undefined);
    	}));
    	
    	
    	it('should shorten the grid if needed',inject(function(transformation) {
    		var grid = transformation.removeExtra(longOldGrid, newGrid);
    		expect(grid.length).toEqual(4);
    	}));
    	
    });    
    
});
