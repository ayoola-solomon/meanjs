'use strict';

//Filters

angular.module('core')
.filter('pagination', function(){
    return function(inputArray, selectedPage, pageSize) {
        var start = parseInt(selectedPage)* parseInt(pageSize);
        var extractedArray = [];
        if(inputArray){
            var end = start + parseInt(pageSize);
            extractedArray = inputArray.slice(start, end);
        }
        return extractedArray;
    };
})
.filter('toPercentage', ['$log', function($log){
    return function(fraction) {

        if(!isNaN(fraction) && ( Math.floor(fraction*100)<= 100) ){
            var percentNumber = 100 * fraction;
            return parseInt(percentNumber) === 0 ? 0: percentNumber + "%";
        }else{
            $log.error("Bham.filter, cannot convert to fraction: " + fraction);
            return "";
        }
    };
}]);
