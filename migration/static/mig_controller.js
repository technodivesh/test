angular.module('migrationApp').controller('loginController',
  ['$scope', '$location', 'AuthService','$window',
  function ($scope, $location, AuthService) {

    $scope.myname = "Divesh";

    $scope.loginSubmit = function (formObj) {
      console.log($scope.username, $scope.password);
      if ($scope.loginForm.$valid){

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.username, $scope.password)
        // handle success
        .then(function () {
          console.log("Success");
          $location.path('/home');
          // $window.location.href = "https://www.google.com/";
          // $window.location.reload();
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

angular.module('migrationApp').controller('logoutController',
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

angular.module('migrationApp').controller('homeController',
  ['$scope', '$location', 
  function ($scope, $location) {

    $scope.myname='chandolia';

}]);

    
// angular.module('migrationApp').controller('mySpmlCtrl', function($scope,$http) {

//     $scope.spmlgen = {};
//     $scope.spmlgen.requestTypeList = [
//         {"requestType": 'AddRequest',    "name": "Add"},
//         {"requestType": 'ModifyRequest', "name": "Modify"}, 
//         {"requestType": 'DeleteRequest', "name": "Delete"}
//     ];
//     $scope.spmlgen.requestType = "AddRequest"; // Default Selection
//     $scope.min = 1; // min range
//     $scope.max = 8; // max range
//     $scope.spmlgen.maxWorkers = 4; // Default Selection
//     $scope.spmlgen.message = '';
//     $scope.spmlgen.show_result = false;
//     $scope.spmlgen.dis_gen_btn = false;
//     $scope.show_result_btn = false;
    
    
//     $scope.spmlgen.noOfEntries = 10000;
//     $scope.spmlgen.min_recods = 10000;
//     $scope.spmlgen.max_recods = 100000;
//     // var requestType = $scope.spmlgen.requestType;
//     $scope.spmlgen.outputPrefix = '';

//     $scope.original = angular.copy($scope.spmlgen);
//     // var userInput={"spmlgen.noOfEntries":$scope.spmlgen.noOfEntries,"maxWorkers":$scope.maxWorkers,"requestType":$scope.requestType,"outputPrefix":$scope.outputPrefix};

//     $scope.spmlgen.decrement=function() {
//         console.log("----------");
//         $scope.spmlgen.noOfEntries -= 10000;
//     }
//     $scope.spmlgen.increment=function() {
//         console.log("+++++++++");
//         $scope.spmlgen.noOfEntries += 10000;
//     }


//     $scope.spmlgen.doGenerate= function(){
//         // alert('doGenerate');

//         if($scope.spmlGenerateForm.$valid) {
//             // console.log("form valid");
//             // $scope.spmlgen.message = "In Progress...";
//             $scope.spmlgen.dis_gen_btn = true;
//             $scope.spmlgen.ShowLoader = true;
            
//             var userInput={"noOfEntries":$scope.spmlgen.noOfEntries,
//                 "maxWorkers":$scope.spmlgen.maxWorkers,
//                 "requestType":$scope.spmlgen.requestType,
//                 "outputPrefix":$scope.spmlgen.outputPrefix
//             };

//             $http({url : '/spmlGenerator', 
//                 method : "POST", 
//                 headers: {'Content-Type': 'application/json'},
//                 data: JSON.stringify(userInput)
//             }).success(function(results) {
//                 // alert ("success");
//                 $scope.spmlgen.dis_gen_btn = false;
//                 $scope.spmlgen.message = "Request Complete";
//                 $scope.show_result_btn = true;
//                 $scope.spmlgen.ShowLoader = false;

//             }).
//             error(function(error) {
//                 // alert ("error");
//                 $scope.spmlgen.dis_gen_btn = false;
//                 $scope.spmlgen.message = "Error while processing";
//                 $scope.spmlgen.ShowLoader = false;
//             });
            
//             // $scope.spmlgen.show_result = false;
//         } else {

//             // $scope.spmlgen.show_result = false;
            
//         }
//     }

//     $scope.spmlgen.reset = function() {
//         $scope.spmlgen= angular.copy($scope.original);
//         $scop.show_result_btn = false;
//         // $scope.spmlgen.submitted = false;
//         $scope.spmlgen.show_result = false;
//         $scope.spmlGenerateForm.$setPristine();
//     };

//     $scope.spmlgen.showresult = function() {
//         $http.get("/showresult")
//         .then(function(response) {
//             $scope.result = response.data;
//             // console.log('result--',$scope.result);
//             $scope.spmlgen.show_result = true;
//             $scope.keys = Object.keys($scope.result);
//             $scope.values = Object.values($scope.result);
//         });
//     }

// });
