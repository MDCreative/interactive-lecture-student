var app = angular.module("app", ["firebase"]);


app.controller("LoginCtrl", function($scope, $firebase) {
	$scope.signin = function(){
    //Firebase.goOnline();
    $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);

    $scope.ref = $scope.mainRef.child('Questions');
    

    var sync = $firebase($scope.ref);
    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "data");


    var conns = $scope.mainRef.child('connections');

    $scope.userRef = $scope.mainRef.child('users').push(1);


    conns.transaction(function (current_value) {
      return (current_value || 0) + 1;
    });

    $scope.ref.limitToLast(1).on("child_added",function(messageSnapshot){


      var time = messageSnapshot.child('time').val();
      var type = messageSnapshot.child('type').val();
      var diff = Date.now() - parseInt(time);
      if(diff <= 120000){
        if (type === 1){

         alert("True or False");

       } 
       else{
         var str = "";
         for(var i = 1;i <= type;i++){


          str += String.fromCharCode(96 + i) + ",";

        }
        alert(str.substring(0,str.length-1));
      }
    }
    triad = new Triad($scope.id);		
  });


  }
  $scope.decrement = function(){
    $scope.userRef.remove();
  }
  $scope.signout = function(){
    $scope.userRef.remove();
    location.reload();
      //Firebase.goOffline();
    }
    $scope.mainRef = function(){
      $scope.decrement();
    }

  });










