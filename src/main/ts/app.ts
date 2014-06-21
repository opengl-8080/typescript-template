import Sample = mine.Sample;

angular
.module('mine', [])
.run(['$rootScope', (scope) => {
    
    var sample = new Sample('AngularJS with TypeScript.');
    
    scope.message = sample.getName();
    
}]);