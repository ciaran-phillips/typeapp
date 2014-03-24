'use strict';

/* Directives */


angular.module('typeApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
  
  angular.module('typeApp.directives', []).
  directive('checkboxSwitch', [function() {
    return {
    	"link":function(scope, elm, attrs) {
	      
    }
    	
    };
  }]);
  
angular.module('typeApp.directives', []).
	directive('rowTransform', [function() {
		return {
			"link":function(scope, elm, attrs) {
				attrs.$observe("size",function(size) {
				    var unit = "em";
				    var fontSize = size + unit;
				    $(elm).animate({fontSize: fontSize},500,function() {});
					
				});
			}
		};
 }]);
 

  

