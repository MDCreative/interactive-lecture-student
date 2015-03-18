var app = angular.module("app", ["firebase"]);


app.directive("login", function(){
  return{
    templateUrl: "assets/html/login.html",
    restrict: "E",
    controller: "LoginCtrl"
  }
});

app.controller("LoginCtrl", function($scope, $firebase) {
	$scope.signin = function(){
    //Firebase.goOnline();
    triad = new Triad($scope.id);   
    $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);
    var width = $( window ).width();
    $('#login').animate({
      left:"-"+ (width + 10) +"px"
    }, 500, function(){
      this.remove();
    });

    $scope.ref = $scope.mainRef.child('Questions');
    console.log("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);

    var sync = $firebase($scope.ref);
    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "data");


    $scope.userRef = $scope.mainRef.child('users').push(1);
    


    $scope.ref.limitToLast(1).on("child_added",function(messageSnapshot){
      var ref = messageSnapshot.ref();
      var time = messageSnapshot.child('time').val();
      var type = messageSnapshot.child('type').val();
      var diff = Date.now() - parseInt(time);
      if(diff <= 120000){
        var mod = new Modal(type, ref, $scope.userRef);
      }

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