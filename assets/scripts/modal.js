/**
 * Modal window used to display the questions and hash tag
 * @param questions number of questions to be asked or null
 * @param ref Firebase reference used for question answering
 * @param userRef The reference to the user in the firebase
 * @param type The type of modal to show
 */
var Modal = function(questions, ref, userRef, type){
  this.id = 'modal'+Math.floor(Math.random()*1000);
  this.div = jQuery('<div/>', {
    class: 'modal hidden',
    id: this.id
  });
  this.ref = ref;
  this.userRef = userRef;
  this.div.appendTo('body');
  this.QUESTION_TIMEOUT = 1000 * 60 * 2;
  /**
   * Close the modal window after processing
   * @param div the div that needs to be closed
   */
  var killMe = function(div){
    width = $( window ).width();
    div.animate({
      left:"-"+ (width + 10) +"px"
    }, 500, 'linear', function(){
      this.remove();
    });
  }
  if(type === "question"){
    this.div.append('<h2 class="ui center aligned header whtTxt">Question</h2>')
    // If the selected question is one then we display true and false
    if (questions === 1){
      this.div.append('<div class="huge ui blue button mza" data-ans="T">True</div><br />');
      this.div.append('<div class="huge ui blue button mza" data-ans="F">False</div>');
    } 
    // otherwise add a button for each question using the char code to put A, B, C, D, etc.
    else{
      var str = "";
      for(var i = 1;i <= questions;i++){
        this.div.append('<div class="huge ui blue button mza" data-ans="'+i+'">'+String.fromCharCode(96 + i)+'</div><br />');   
      }
    }

    this.div.find(".button").on('click',{div: this.div, ref: this.ref, userRef: this.userRef},function(e){

      var answer = {};
      answer[e.data.userRef.key()] = {
        answer: $(this).attr('data-ans')
      };
      ref.child('answers').update(answer);
      width = $( window ).width();
      e.data.div.animate({
        left:"-"+ (width + 10) +"px"
      }, 500, function(){
        this.remove();
      });
    });
    setTimeout(killMe,this.QUESTION_TIMEOUT, this.div );
  } else if(type === "hashtag"){
    // Build hashtag form for the user
    hshtagBox = $('<input type="text" id="hshtag-box" class="textbox mza marg-bottom sign-in-text"/>');
    this.div.addClass("hashtag");
    this.div.append('<div class="ui form"><h2 class="ui center aligned header whtTxt">Enter a word or phrase</h2>')
      .append(hshtagBox)
      .append('<div class="huge ui blue button mza" id="sendButton">Send</div>')
      .append('<div class="huge ui red button mza" id="cancelButton">Cancel</div>')
      .append('</div>');
    hshtagBox.focus();
    /**
     * Click event for the senb button once clicked the user's input is validated and sent to the firebase.
     */
    this.div.find("#sendButton").on('click',{div: this.div, ref: this.ref, userRef: this.userRef},function(e){
      var hashtagText = hshtagBox.val();
      if(hashtagText === ""){
        var pu = new Popup();
        pu.ask("Please enter some text", ["OK"]);
      } else {
        ref.child('hashtags').push({
          time: Firebase.ServerValue.TIMESTAMP,
          tag: camelcase(hashtagText)
        })
        killMe($(this).parent());
      }
    });

    this.div.find("#cancelButton").on('click',{div: this.div},function(e){
      killMe($(this).parent());
    });    

  }
  // animate the div into view once it has loaded
  this.div.animate({
    top:"0px"
  }, 500);
}

/**
 * camelcase function converts a string to camel case used for hashtagging
 */
function camelcase(string){
  string.replace('#', '');
  var vals = string.split(/\s/);
  if(vals.length > 1){
    var str = "";

    for(var i = 0; i < vals.length; i++)
    {
      for(var j = 0; j < vals[i].length; j++)
      {
        if(vals[i][j].match(/[^a-zA-Z0-9]/g))
          continue;
        
        if(j == 0)
          str += vals[i][j].toUpperCase();
        else
          str += vals[i][j].toLowerCase();
      }
    }
  } else {
    str = vals[0];
  }

  return str;
}


