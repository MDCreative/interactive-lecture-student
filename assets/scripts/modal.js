var Modal = function(questions, ref, userRef){
	this.id = 'modal'+Math.floor(Math.random()*1000);
	this.div = jQuery('<div/>', {
		class: 'modal hidden',
		id: this.id
	});
	this.ref = ref;
	this.userRef = userRef;
	this.div.appendTo('body');
	this.div.append('<h2 class="ui center aligned header">Question</h2>')
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

	var killMe = function(div){
		width = $( window ).width();
		div.animate({
			left:"-"+ (width + 10) +"px"
		}, 500, function(){
			this.remove();
		});
	}

	setTimeout(killMe,3000, this.div );

	

	this.div.animate({
		top:"0px"
	}, 500);
}