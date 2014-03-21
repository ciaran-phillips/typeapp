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
  

