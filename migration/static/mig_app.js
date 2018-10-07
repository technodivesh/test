var migrationApp = angular.module('migrationApp', ['ui.router']);

migrationApp.config(function($stateProvider,$urlRouterProvider) {

    $stateProvider

    // .state('index', {
    //   url:'/index',
    //   views:{
    //     '@':{
    //       templateUrl:'static/partial/index.html'
    //     }
    //   }
    // })
    // .state('index.home', {
    //   url:'/home',
    //   views:{
    //     'home-uv@index':{
    //       templateUrl:'static/partial/home.html',
    //       controller: 'homeController'
    //     }
    //   }
    // })
    .state('index', {
      url:'/index',
      templateUrl: 'static/partial/index.html',
    })
    .state('home', {
      url:'/home',
      templateUrl: 'static/partial/home.html',
      controller: 'homeController'
    })
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
    })
    .state('spmlgenerator', {
        url: '/spmlgenerator',
        templateUrl: 'static/partial/SPMLGenerator.html',
        controller: 'mySpmlCtrl'
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