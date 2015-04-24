/**
 * The angular app which the whole student process will use
 */
var app = angular.module("app", ["firebase"]);

/**
 * Login directive used to process a users login
 */
app.directive("login", function(){
  return{
    templateUrl: "assets/html/login.html",
    restrict: "E",
    controller: "LoginCtrl"
  }
});

/**
 * Hashtag directive allows users to send hashtags to the system
 */
app.directive("hashtag", function(){
  return{
    templateUrl: "assets/html/hashtag.html",
    restrict: "E",
    controller: "HashTagCtrl"
  }
});

/**
 * Provides the user with logout functionality
 */
app.directive("logout", function(){
  return{
    templateUrl: "assets/html/logout.html",
    restric: "E",
    controller: "LogOutCtrl"
  }
});

/**
 * Logout controller used to sign the user out
 */
app.controller("LogOutCtrl", function($scope, $firebase){
  /**
   * Signs the user out of the lecture by reloading the page
   * user is prompted to confirm first.
   */
  $scope.signout = function(){
    var pu = new Popup();
    var logout = function(){
      $scope.userRef.remove();
      location.reload();
    }
    pu.ask('Are you sure you want to log out', ['Yes', 'No'], [logout]);
  };
});

/**
 * Login controller, signs the user into the system.
 */
app.controller("LoginCtrl", function($scope, $firebase) {
  /**
   * Sign a user into the system
   */
	$scope.signin = function(){
    //Firebase.goOnline();
    triad = new Triad($scope.id);   
    // We are going to check that the lecture exists and has a status of 1 (open)
    $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);
      $scope.mainRef.child('status').once('value', function(snapshot) {
        exists = (snapshot.val() == 1);
        // The lecture id is invalid
        if(!exists || $scope.id == ""){
          var pu = new Popup();
          pu.ask("Please enter a valid code", ["OK"]);
        } else {
          var width = $( window ).width();
          // Animate the login prompt away
          $('#login').animate({
            left:"-"+ (width + 10) +"px"
          }, 500, function(){
            this.remove();
          });
          // Build firebase reference to the question node of the lecture
          $scope.ref = $scope.mainRef.child('Questions');

          var sync = $firebase($scope.ref);
          var syncObject = sync.$asObject();
          syncObject.$bindTo($scope, "data");

          // Add the user to the lecture
          $scope.userRef = $scope.mainRef.child('users').push(1);


          /**
           * Triggers when a lecturer poses a question. Will show on all clients
           * but only in a 2 mminute period
           */
          $scope.ref.limitToLast(1).on("child_added",function(messageSnapshot){
            var ref = messageSnapshot.ref();
            var time = messageSnapshot.child('time').val();
            var type = messageSnapshot.child('type').val();
            var diff = Date.now() - parseInt(time);
            // If the question was posed less than 2 minutes ago
            if(diff <= 120000){
              var mod = new Modal(type, ref, $scope.userRef, "question");
            }

          });
        }

      });



}
/**
 * Logic for the hashtag submit process
 */
app.controller("HashTagCtrl", function($scope, $firebase){
  $scope.mainRef = new Firebase("https://interactive-lecture.firebaseio.com/Test/"+$scope.id);
  /**
   * Invokes a modal window to get the hashtag from the user
   */
  $scope.showmodal = function(){
    var mod = new Modal(null, $scope.mainRef, null, "hashtag");
  }
});