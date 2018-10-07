angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {
      console.log($scope.username, $scope.password);
      if ($scope.loginForm.$valid){

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.username, $scope.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          // $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          console.log("catch---");
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          // $scope.loginForm = {};
        });

      }else{
        console.log("Invalid Form");
        $scope.error = true;
        $scope.errorMessage = "Invalid username and/or password";
      }
    };

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

