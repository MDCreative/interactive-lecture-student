var app = angular.module("app", ["firebase"]);


app.directive("login", function(){
  return{
    templateUrl: "assets/html/login.html",
    restrict: "E",
    controller: "LoginCtrl"
  }
});

app.directive("hashtag", function(){
  return{
    templateUrl: "assets/html/hashtag.html",
    restrict: "E",
    controller: "HashTagCtrl"
  }
});

app.controller("LoginCtrl", function($scope, $firebase) {
	$scope.signin = function(){
    //Firebase.goOnline();
    triad = new Triad($scope.id);   
    $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);
      $scope.mainRef.child('status').once('value', function(snapshot) {
        exists = (snapshot.val() == 1);
        if(!exists || $scope.id == ""){
          var pu = new Popup();
          pu.ask("Please enter a valid code", ["OK"]);
          alert("Please enter a valid code");
        } else {
          var width = $( window ).width();
          $('#login').animate({
            left:"-"+ (width + 10) +"px"
          }, 500, function(){
            this.remove();
          });

          $scope.ref = $scope.mainRef.child('Questions');

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
              var mod = new Modal(type, ref, $scope.userRef, "question");
            }

          });
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


app.controller("HashTagCtrl", function($scope, $firebase){
  $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);
  $scope.showmodal = function(){
    var mod = new Modal(null, $scope.mainRef, null, "hashtag");
  }
});