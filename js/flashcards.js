var index;
//The flash card function to show a new sight word
var oldindex = index = -1;
flashcard = function(){
	while(index == oldindex){ 
		//get a new sight word until the new index and old index are different, this ensures that we dont show the same word twice
		index = _getRandom(0,sight_words.length-1);
	}

	var stage = document.getElementById('stage'); //find the stage
	stage.classList.remove('allowchange'); //set it back to default state
	stage.innerText = sight_words[index]; //add the new sight word to the stage
	fitText(stage, .3); //run fittext

	//this is done to restart the CSS animation
	var elm = document.getElementById('bubble-button');
	elm.classList.add('allowplay');
	var newOne = elm.cloneNode(true);
	elm.parentNode.replaceChild(newOne, elm);

	//wait 5.5 seconds before we allow the child to flip to the next word
	setTimeout(function(){ stage.classList.add('allowchange'); }, 5500);

	//set the index as the old index for later
	oldindex = index;
};
flashcard();
document.addEventListener('click', function(e) {
	if(e.target.className.indexOf('bubble') != -1 && e.target.className.indexOf('allowplay') != -1){
		var source1 = context.createBufferSource();
		source1.buffer = myBufferList[index];
		source1.connect(context.destination);
		source1.start(0);
		e.target.classList.remove('allowplay');
		//wait 3 seconds before we allow the child to play the audio again
		setTimeout(function(){ e.target.classList.add('allowplay'); }, 3000);
	}
	else if(e.target.className == 'controller'){
		console.log(e.target.parent);
		e.target.parentNode.className = "open";
	}
	else{
		if(e.target.className.indexOf('allowchange') != -1){
			flashcard();
		}
	}
}, false);