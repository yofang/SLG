tapp=angular.module("taskApp", ['ngRoute','ngTouch']);
 tapp.run(function ($http, $templateCache) {
     $http.get("Views/Partial/cube.png", { cache: $templateCache });
 });
tapp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider,$log) {

    //$locationProvider.html5Mode(true).hashPrefix('!')
    $routeProvider
    .when('/TaskCalender', {
        controller: 'taskCtlr',
        templateUrl:'Views/Partial/task.html'
    }).otherwise({
        redirectTo:'/TaskCalender'
    });
}]);
