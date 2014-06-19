angular
.module('mine', [])
.run(['$rootScope', (scope) => {
    scope.message = 'AngularJS with TypeScript.';
}]);