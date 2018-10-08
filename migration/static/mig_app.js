var migrationApp = angular.module('migrationApp', ['ui.router']);

migrationApp.config(function($stateProvider,$urlRouterProvider) {

    $stateProvider

    .state('home', {
      url:'/home',
      templateUrl: 'static/partial/home.html',
      controller: 'homeController'
    })

    .state('home.spmlgenerator', {
        url: '/spmlgenerator',
        templateUrl: 'static/partial/SPMLGenerator.html',
        controller: 'mySpmlCtrl'
    })


    // .state('index', {
    //   url:'/index',
    //   templateUrl: 'static/partial/index.html',
    // })
    // .state('home', {
    //   url:'/home',
    //   templateUrl: 'static/partial/home.html',
    //   controller: 'homeController'
    // })


    .state('login', {
      url: '/login',
      templateUrl: 'static/partial/login.html',
      controller: 'loginController'
    })
    .state('logout', {
      url: '/logout',
      controller: 'logoutController'
    })
    .state('one', {
      url: '/one',
      template: '<h1>This is page one!</h1>'
    });

    $urlRouterProvider.otherwise('/home')
});

migrationApp.run(function ($rootScope, $location, AuthService) {
  $rootScope.$on('$stateChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (!AuthService.isLoggedIn()){
          // alert('login');
          $location.path('/login').replace();
          // $route.reload();
        }
      });
  });
});