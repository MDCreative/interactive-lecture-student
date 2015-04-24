/**
 * Popup window used to show users various bits of information. Replaces the
 * JS alert function
 */
var Popup = function(){
  /**
   * prompt the user with a message
   * @param message The message to be displayed
   * @param buttons Array of strings for the buttons
   * @params functions Array of functions to be invoked when a button is pressed based on their respective indeces
   */
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
    /**
     * When a button is pressed we check for a corresponding function to invoke
     * if it exists we invoke it otherwise we do nothing.
     */
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
  /**
   * Close the modal window after processing
   * @param div the div that needs to be closed
   */
  this.killMe = function(div){
    width = $( window ).width();
    div.animate({
      left:"-"+ (width + 10) +"px"
    }, 500, 'linear', function(){
      this.remove();
    });
  }

}