var Popup = function(){

  this.ask = function(message, buttons){
    this.id = 'modal'+Math.floor(Math.random()*1000);
    this.div = jQuery('<div/>', {
      class: 'modal hidden',
      id: this.id
    });
    this.div.append('<div class="ui form"><h2 class="ui center aligned header whtTxt">'+message+'</h2>');
    buttons.foreach(function(but, index){
      this.div.append('<div class="huge ui blue button mza" data-ans="'+index+'">'+but+'</div><br />');
    });
    this.div.append('</div>');
    this.find('.button').on('click', {_this : this}, function(){
      console.log($(this).attr('data-ans'));
      _this.killMe();
    });
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