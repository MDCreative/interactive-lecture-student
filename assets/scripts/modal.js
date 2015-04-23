var Modal = function(questions, ref, userRef, type){
  this.id = 'modal'+Math.floor(Math.random()*1000);
  this.div = jQuery('<div/>', {
    class: 'modal hidden',
    id: this.id
  });
  this.ref = ref;
  this.userRef = userRef;
  this.div.appendTo('body');
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
    if (questions === 1){
      this.div.append('<div class="huge ui blue button mza" data-ans="T">True</div><br />');
      this.div.append('<div class="huge ui blue button mza" data-ans="F">False</div>');
    } 
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
    setTimeout(killMe,6000, this.div );
  } else if(type === "hashtag"){
    hshtagBox = $('<input type="text" id="hshtag-box" class="textbox mza marg-bottom sign-in-text"/>');
    this.div.addClass("hashtag");
    this.div.append('<div class="ui form"><h2 class="ui center aligned header whtTxt">Enter a word or phrase</h2>')
      .append(hshtagBox)
      .append('<div class="huge ui blue button mza" id="sendButton">Send</div>')
      .append('<div class="huge ui red button mza" id="cancelButton">Cancel</div>')
      .append('</div>');
    hshtagBox.focus();

    this.div.find("#sendButton").on('click',{div: this.div, ref: this.ref, userRef: this.userRef},function(e){
      var hashtagText = hshtagBox.val();
      if(hashtagText === ""){
        alert("please supply some text");
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


