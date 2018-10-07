var migrationToolGui = angular.module('MigrationTool', ['ui.router','ng-ip-address']);

        
migrationToolGui.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('spmlgenerator', {
            url: '/spmlgenerator',
            templateUrl: 'static/partial/SPMLGenerator.html',
            controller: 'mySpmlCtrl'
        })

    .state('transfertopgw', {
            url: '/transfertopgw',
            templateUrl: 'static/partial/TransferToPgw.html',
            controller: 'toPgwCtrl'
        })

    .state('transferfrompgw', {
            url: '/transferfrompgw',
            templateUrl: 'static/partial/TransferFromPgw.html',
            controller: 'transferFromPgwCtrl'
        })
    // Divesh
    .state('mytest', {
            url: '/mytest',
            templateUrl: 'static/partial/mytest.html',
            controller: 'mytestCtrl'
        })

    .state('displayerror', {
            url: '/displayerror/:filename',
            templateUrl: 'static/partial/EmptyGrid.html',
            controller: 'displayerrorCtrl'
        })

    .state('spmlgeneratorerr', {
            url: '/spmlgeneratorerr',
            templateUrl: 'static/partial/SpmlGeneratorErrFiles.html',
            controller: 'spmlgeneratorerrCtrl'
        })

    .state('displaygenerror', {
            url: '/displaygenerror/:filename',
            templateUrl: 'static/partial/SpmlGenResponse.html',
            controller: 'displaygenerrorCtrl'
        })

        
    .state('spmlresponseAnal', {
            url: '/spmlresponseAnal',
            templateUrl: 'static/partial/SpmlResponseAnal.html',
            controller: 'spmlresponseAnalCtrl'
        });

});

migrationToolGui.controller('toPgwCtrl', function($scope,$http) {

    $scope.selectedAll = false;

    $scope.pgwdetails = [
        {
            'ipaddr':'',
            'userName':'',
            'passwd':'',
            'tenant':'',
            'outPrefix':'',
            'noOfFiles':''
        }];


    $scope.addNew = function(pgwdetail){
        $scope.pgwdetails.push({ 
            'ipaddr':'',
            'userName':'',
            'passwd':'',
            'tenant':'',
            'outPrefix':'',
            'noOfFiles':''
        });
    };

    $scope.remove = function(){
        var newDataList=[];
        // $scope.selectedAll = false;
        angular.forEach($scope.pgwdetails, function(selected){
            if(!selected.selected){
                newDataList.push(selected);
            }
        }); 
        $scope.pgwdetails = newDataList;
    }


    $scope.checkAll = function () {
        angular.forEach($scope.pgwdetails, function(pgwdetail) {
            pgwdetail.selected = $scope.selectedAll;
        });
    };


    $scope.reset = function () {
        $scope.submitted = false;
        $scope.message = '';
        $scope.err_message='';
        $scope.pgwdetails = [
        {
            'ipaddr':'',
            'userName':'',
            'passwd':'',
            'tenant':'',
            'outPrefix':'',
            'noOfFiles':''
        }];
    }
    ////////////////////////////////////////

    // $scope.doPrepare = function(argument) {
    //     // body...
    //     $scope.submitted = true;
    //     console.log($scope.transfertopgwForm);
    //     if($scope.transfertopgwForm.$valid) {
    //         console.log("valid--");

    //     }else{
    //         console.log("invalid--");
    //     }
    // }

    //////////////////////////divesh////////////////////

    $scope.doPrepare = function(argument) {

        console.log("doPrepare called--");

        if($scope.transfertopgwForm.$valid) {
            console.log("form valid -- ");
            $scope.message = "In Progress...";
            $scope.err_message='';
            $scope.dis_pre_btn = true;
            
            var userInput= $scope.pgwdetails;

            $http({url : '/start', 
                method : "POST", 
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(userInput)
            }).
            success(function(results) {
                // alert ("success");
                $scope.dis_pre_btn = false;
                $scope.message = "Request Completed";
            }).
            error(function(error) {
                // alert ("error");
                $scope.dis_pre_btn = false;
                $scope.err_message = "Error while processing"
                $scope.message='';
            });
            
            $scope.submitted = false;
            $scope.show_result = false;
        } else {

            console.log("form invalid --");
            $scope.submitted = true;
            $scope.show_result = false;
            
        }
    }

    ////////////////////divesh/////////////////////


    // $scope.doPrepare = function(){
 //        alert("doPrepare--",userInput);
    //  $http({url : '/start', method : "POST", headers: {'Content-Type': 'application/json'},data: JSON.stringify(userInput)}).
    //      success(function(results) {
    //      alert ("success");
    //  }).
    //  error(function(error) {
    //      alert ("error");
    //  });
    // }

    $scope.doTransfer= function(){
        alert("Transferred called");
        $http({url : '/transfer', method : "POST", headers: {'Content-Type': 'application/json'},data: JSON.stringify(userInput)}).
                success(function(results) {
                alert ("success");
        }).
        error(function(error) {
                alert ("error");
        });
    }
});

migrationToolGui.controller('transferFromPgwCtrl', function($scope,$http) {
        $scope.number = "1";
        var userInput = $scope.number;


        $scope.doTransfer= function(){
                alert("Transferred from pgw called");
                $http({url : '/transferfrompgw', method : "POST", headers: {'Content-Type': 'application/json'},data: JSON.stringify(userInput)}).
                        success(function(results) {
                        alert ("success");
                }).
                error(function(error) {
                        alert ("error");
                });
        }
});

migrationToolGui.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

migrationToolGui.controller('displayerrorCtrl', function($scope,$http,$stateParams) {
    var filename = $stateParams.filename;
    $http.get("displayerror",{params:{filename: filename}})
    .then(function(response) {
        $scope.responses = response.data;
    });
});

migrationToolGui.controller('spmlresponseAnalCtrl', function($scope,$http) {


        $scope.doDisplayResponse= function(userInput){
                alert("Display PGW Response called ");
         $http.get("spmlresponseAnal",{params:{userInput: userInput}})
            .then(function(response) {
                $scope.responses = response.data;
            });

        }
});

migrationToolGui.controller('spmlgeneratorerrCtrl', function($scope,$http) {
     $http.get("spmlgeneratorerr")
    .then(function(result) {
        $scope.responses = result.data;
    });


});

migrationToolGui.controller('displaygenerrorCtrl', function($scope,$http,$stateParams) {
        var filename = $stateParams.filename;
        $http.get("displaygenerror",{params:{filename: filename}})
    .then(function(response) {
        $scope.responses = response.data;
    });
});



    
migrationToolGui.controller('mySpmlCtrl', function($scope,$http) {

    $scope.spmlgen = {};
    $scope.spmlgen.requestTypeList = [
        {"requestType": 'AddRequest',    "name": "Add"},
        {"requestType": 'ModifyRequest', "name": "Modify"}, 
        {"requestType": 'DeleteRequest', "name": "Delete"}
    ];

    $scope.spmlgen.message = '';
    $scope.spmlgen.submitted = false;
    $scope.spmlgen.show_result = false;
    $scope.spmlgen.dis_gen_btn = false;
    $scope.show_result_btn = false;
    
    
    $scope.spmlgen.noOfEntries = 50000;
    $scope.spmlgen.maxWorkers = '4';
    // var requestType = $scope.spmlgen.requestType;
    $scope.spmlgen.outputPrefix = '';

    $scope.original = angular.copy($scope.spmlgen);
    // var userInput={"spmlgen.noOfEntries":$scope.spmlgen.noOfEntries,"maxWorkers":$scope.maxWorkers,"requestType":$scope.requestType,"outputPrefix":$scope.outputPrefix};

    $scope.doGenerate= function(){
        // alert('doGenerate');

        if($scope.spmlGenerateForm.$valid) {
            // console.log("form valid");
            $scope.spmlgen.message = "In Progress...";
            $scope.spmlgen.dis_gen_btn = true;
            
            var userInput={"noOfEntries":$scope.spmlgen.noOfEntries,
                "maxWorkers":$scope.spmlgen.maxWorkers,
                "requestType":$scope.spmlgen.requestType,
                "outputPrefix":$scope.spmlgen.outputPrefix
            };

            $http({url : '/spmlGenerator', 
                method : "POST", 
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(userInput)
            }).success(function(results) {
                // alert ("success");
                $scope.spmlgen.dis_gen_btn = false;
                $scope.spmlgen.message = "Request Completed";
                $scope.show_result_btn = true;

                // result = eval(results)
                // $scope.spmlgen.total = result[0]
                // $scope.spmlgen.succ = result[1]
                // $scope.spmlgen.err = result[2]
                // $scope.spmlgen.show_result = true;
            }).
            error(function(error) {
                // alert ("error");
                $scope.spmlgen.dis_gen_btn = false;
                $scope.spmlgen.message = "Error while processing"
            });
            
            $scope.spmlgen.submitted = false;
            $scope.spmlgen.show_result = false;
        } else {

            // console.log("form has error");
            // console.log("SPML generator called");
            // console.log($scope.spmlGenerateForm);
            // console.log($scope.spmlgen.requestType);

            $scope.spmlgen.submitted = true;
            $scope.spmlgen.show_result = false;
            
        }
    }

    $scope.reset = function() {
        $scope.spmlgen= angular.copy($scope.original);
        // $scop.show_result_btn = false;
        // $scope.spmlgen.submitted = false;
        $scope.spmlGenerateForm.$setPristine();
    };

    $scope.show_result = function() {
        $http.get("/showresult")
        .then(function(response) {
            $scope.result = response.data;
            // console.log('result--',$scope.result);
            $scope.spmlgen.show_result = true;
            $scope.keys = Object.keys($scope.result);
            $scope.values = Object.values($scope.result);
        });
    }

});



migrationToolGui.controller('mytestCtrl', function($scope,$http) {

    $scope.allowPort = {allowPort: true};
    $scope.requirePort = {requirePort: true};
    $scope.portConfig = {allowPort: true, requirePort: false};

    $scope.testmsg = "testmsg";
    $scope.testip = "";

});