var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'static/partial/home.html'
    })
    .when('/login', {
      templateUrl: 'static/partial/login.html',
      controller: 'loginController'
    })
    .when('/logout', {
      controller: 'logoutController'
    })
    .when('/one', {
      template: '<h1>This is page one!</h1>'
    
    })
    .when('/two', {
      template: '<h1>This is page two!</h1>'
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (!AuthService.isLoggedIn()){
          $location.path('/login');
          // $route.reload();
        }
      });
  });
});