var Popup = function(){

  this.ask = function(message, buttons, functions){
    this.id = 'modal'+Math.floor(Math.random()*1000);
    this.div = jQuery('<div/>', {
      class: 'modal hidden popup',
      id: this.id
    });
    this.div.append('<div class="ui form"><h2 class="ui center aligned header whtTxt">'+message+'</h2>');
    var div = this.div;
    buttons.forEach(function(but, index){
      div.append('<div class="huge ui blue button mza" data-ans="'+index+'">'+but+'</div><br />');
    });
    this.div.append('</div>');
    this.div.appendTo('body');
    var _this = this;
    this.div.find('.button').on('click', function(){
      var ans = $(this).attr('data-ans');

      if(typeof functions !== "undefined"){
        if(ans < functions.length)
          functions[ans]();
      };
      _this.killMe(div);
    });
    this.div.animate({
      top:"0px"
    }, 500);
  }

  this.killMe = function(div){
    width = $( window ).width();
    div.animate({
      left:"-"+ (width + 10) +"px"
    }, 500, 'linear', function(){
      this.remove();
    });
  }

}