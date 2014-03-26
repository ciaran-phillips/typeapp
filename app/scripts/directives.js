'use strict';

/* Directives */


var myApp = angular.module('typeApp.directives', []);
myApp.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
  

  
myApp.directive('rowTransform', [function() {
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
 
myApp.directive('overlay',function() {
	return {
		"link": function(scope, elm, attrs) {
			elm.bind('click',function() {
				var id = attrs.overlay;
				var elem = $("#" + id);
				$(elem).toggle();
			});
		}
	};
});
  

