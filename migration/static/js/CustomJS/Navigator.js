var migrationToolGui = angular.module('MigrationTool', ['ui.router','ngResource']);

        
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
        })

    .state('spmlresult', {
            url: '/spmlresult',
            templateUrl: 'static/partial/spmlresult.html',
            controller: 'spmlresultCtrl'
        });

});

migrationToolGui.controller('toPgwCtrl', function($scope,$http,$anchorScroll) {

    $scope.topgw = {}
    $scope.topgw.submitted = false;

    var pgwdetail = {
        'ipaddr':'',
        'userName':'',
        'passwd':'',
        'tenant':'',
        'outPrefix':'',
        'noOfFiles':''
        }

    $scope.topgw.pgwdetails = [];

    $scope.ipaddr = "222.222.222.222";
    $scope.userName = "testing";
    $scope.passwd = "testing";
    $scope.tenant = "testing";
    $scope.outPrefix = "testing";
    $scope.noOfFiles = 5;
    var original = $scope.topgw;

    $scope.topgw.add_new = function(){
        console.log('add_new --');
        $scope.topgw.submitted = true;
        if($scope.pgwdetailForm.$valid) {
            console.log('Valid--');
            $scope.topgw.pgwdetails.push({ 
                'ipaddr':$scope.ipaddr,
                'userName':$scope.userName,
                'passwd':$scope.passwd,
                'tenant':$scope.tenant,
                'outPrefix':$scope.outPrefix,
                'noOfFiles':$scope.noOfFiles
            });
            // $scope.topgw.reset();
        }else{
            console.log('Invalid --');
            // Show check form fileds
            // $scope.err_message = "Please check form fields"
        }
        
    };

    $scope.topgw.reset = function(num){

        console.log("reset--");

        if(num==1){
            $scope.topgw= angular.copy(original);
            $scope.pgwdetailForm.$setPristine();
            $scope.topgw.submitted = false;
            $scope.ipaddr='';
            $scope.userName='';
            $scope.passwd='';
            $scope.tenant='';
            $scope.outPrefix='';
            $scope.noOfFiles='';
        }else if(num==2){
            $scope.topgw.pgwdetails = [];
        }
        $scope.topgw.err_message='';
        $scope.topgw.message='';
    }

    $scope.topgw.remove = function(index){
        console.log("index--",index);
        $scope.topgw.pgwdetails.splice(index, 1);
    }

    $scope.topgw.edit = function(index){
        console.log("index--",index);
        console.log($scope.topgw.pgwdetails[index]);
        $scope.ipaddr= $scope.topgw.pgwdetails[index].ipaddr
        $scope.userName= $scope.topgw.pgwdetails[index].userName
        $scope.passwd= $scope.topgw.pgwdetails[index].passwd
        $scope.tenant= $scope.topgw.pgwdetails[index].tenant
        $scope.outPrefix= $scope.topgw.pgwdetails[index].outPrefix
        $scope.noOfFiles= $scope.topgw.pgwdetails[index].noOfFiles
        $scope.topgw.pgwdetails.splice(index, 1);
        $anchorScroll();
    }


    $scope.topgw.doPrepare = function(argument) {

        console.log("doPrepare called--");

        // $scope.topgw.message = "In Progress...";
        $scope.topgw.err_message='';
        $scope.topgw.dis_pre_btn = true;
        $scope.ShowLoader=true;
        var userInput= $scope.topgw.pgwdetails;

        $http({url : '/start', 
            method : "POST", 
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(userInput)
        }).
        success(function(results) {
            // alert ("success");
            $scope.topgw.dis_pre_btn = false;
            $scope.topgw.message = "Request Complete";
            $anchorScroll();
            $scope.ShowLoader=false;
        }).
        error(function(error) {
            // alert ("error");
            $scope.topgw.dis_pre_btn = false;
            $scope.topgw.err_message = "Error while processing"
            $scope.topgw.message='';
            $anchorScroll();
            $scope.ShowLoader=false;
        });
        
        $scope.submitted = false;
        $scope.show_result = false;
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

    $scope.topgw.doTransfer= function(){

        var userInput= $scope.topgw.pgwdetails;
        $anchorScroll();
        $scope.ShowLoader=true;
        // $scope.topgw.message = "In Progress...";
        // alert("Transferred called");
        $http({url : '/transfer', method : "POST", headers: {'Content-Type': 'application/json'},data: JSON.stringify(userInput)}).
        success(function(results) {
            $scope.topgw.message = "Request Complete";
            $anchorScroll();
            $scope.ShowLoader=false;
        }).
        error(function(error) {
                // alert ("error");
                $scope.topgw.err_message = "Error while processing"
                $scope.topgw.message='';
                $anchorScroll();
                $scope.ShowLoader=false;
            });
    }
});

migrationToolGui.controller('transferFromPgwCtrl', function($scope,$http) {
    $scope.number = 1;
    var userInput = $scope.number;
    $scope.frompgw ={};
    $scope.frompgw.ShowLoader=false;
    // $scope.frompgw.message = "In Progress...";

    $scope.frompgw.reset = function() {
        $scope.number = 1;
        $scope.frompgw.message = "";
    }

    $scope.frompgw.doTransfer= function(){

        console.log("frompgw.doTransfer--");
        // $scope.frompgw.message = "In Progress...";
        $scope.frompgw.ShowLoader = true;
        // alert("Transferred from pgw called");
        $http({url : '/transferfrompgw', method : "POST", headers: {'Content-Type': 'application/json'},data: JSON.stringify(userInput)}).
        success(function(results) {
            // alert ("success");
            $scope.frompgw.message = "Request Complete";
            $scope.frompgw.ShowLoader = false;
        }).
        error(function(error) {
            // alert ("error");
            $scope.frompgw.err_message = "Error while processing"
            $scope.frompgw.message='';
            $scope.frompgw.ShowLoader = false;
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

    // $scope.pgwnumber = 1;
    $scope.doDisplayResponse= function(userInput){
        // alert($scope.pgwnumber);
     $http.get("spmlresponseAnal",{params:{userInput: $scope.pgwnumber}})
        .then(function(response) {
            $scope.responses = response.data;
        });

    }

    $scope.reset=function(argument) {
        $scope.responses ="";
        $scope.pgwnumber = 1;
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
    $scope.spmlgen.requestType = "AddRequest"; // Default Selection
    $scope.min = 1; // min range
    $scope.max = 8; // max range
    $scope.spmlgen.maxWorkers = 4; // Default Selection
    $scope.spmlgen.message = '';
    $scope.spmlgen.show_result = false;
    $scope.spmlgen.dis_gen_btn = false;
    $scope.show_result_btn = false;
    
    
    $scope.spmlgen.noOfEntries = 10000;
    $scope.spmlgen.min_recods = 10000;
    $scope.spmlgen.max_recods = 100000;
    // var requestType = $scope.spmlgen.requestType;
    $scope.spmlgen.outputPrefix = '';

    $scope.original = angular.copy($scope.spmlgen);
    // var userInput={"spmlgen.noOfEntries":$scope.spmlgen.noOfEntries,"maxWorkers":$scope.maxWorkers,"requestType":$scope.requestType,"outputPrefix":$scope.outputPrefix};

    $scope.spmlgen.decrement=function() {
        console.log("----------");
        $scope.spmlgen.noOfEntries -= 10000;
    }
    $scope.spmlgen.increment=function() {
        console.log("+++++++++");
        $scope.spmlgen.noOfEntries += 10000;
    }


    $scope.spmlgen.doGenerate= function(){
        // alert('doGenerate');

        if($scope.spmlGenerateForm.$valid) {
            // console.log("form valid");
            // $scope.spmlgen.message = "In Progress...";
            $scope.spmlgen.dis_gen_btn = true;
            $scope.spmlgen.ShowLoader = true;
            
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
                $scope.spmlgen.message = "Request Complete";
                $scope.show_result_btn = true;
                $scope.spmlgen.ShowLoader = false;

            }).
            error(function(error) {
                // alert ("error");
                $scope.spmlgen.dis_gen_btn = false;
                $scope.spmlgen.message = "Error while processing";
                $scope.spmlgen.ShowLoader = false;
            });
            
            // $scope.spmlgen.show_result = false;
        } else {

            // $scope.spmlgen.show_result = false;
            
        }
    }

    $scope.spmlgen.reset = function() {
        $scope.spmlgen= angular.copy($scope.original);
        $scop.show_result_btn = false;
        // $scope.spmlgen.submitted = false;
        $scope.spmlgen.show_result = false;
        $scope.spmlGenerateForm.$setPristine();
    };

    $scope.spmlgen.showresult = function() {
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