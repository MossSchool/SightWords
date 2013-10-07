var index;
var selectedIndex;
//The flash card function to show a new sight word
var oldindex = index = -1;
gameboard = function(howManyCards){
	isShowingCorrect = false;
	if(typeof(howManyCards) == 'undefined'){ howManyCards = 3; }

	if(typeof(myBufferList) == 'undefined'){
		//audio isnt ready yet, try again in 500ms
		setTimeout(function(){ gameboard(howManyCards);},500);
		return;
	}

	//pick how ever many random words
	var indices = [];
	for(i=0; i < howManyCards; i++){ //go and get how ever many cards are requested
		index = -1;
		while(index == -1 || indices.indexOf(index) != -1){ //go and get a new unique index
			index = _getRandom(0,sight_words.length-1);
		}
		indices.push(index); //add the unique index to the array
	}
	console.log(indices);

	//from these words, pick one to be the word we want to find
	selectedIndex = indices[_getRandom(0,indices.length-1)];
	console.log(selectedIndex);




	var board = document.getElementById('gameboard'); //find the board
	board.classList.remove('three-up', 'six-up', 'ten-up');
	board.classList.add((howManyCards == 10 ? 'ten-up' : (howManyCards == 6 ? 'six-up' : 'three-up')));
	for(j=0; j < indices.length; j++){
		var button = document.createElement('button');
		button.className = 'card nav__item';
		button.dataset.cardid = indices[j];
		button.innerHTML = sight_words[indices[j]];
		board.appendChild(button);
	}

	//play "find the word"
	var source0 = context.createBufferSource();
	source0.buffer = findTheWord;
	source0.connect(context.destination);
	source0.start(0);

	setTimeout(function(){
		//then say the word
		var source1 = context.createBufferSource();
		source1.buffer = myBufferList[selectedIndex];
		source1.connect(context.destination);
		source1.start(0);
	}, 1000);
};
gameboard(3);

var internal_score = 0; //keep this so we know when to go to the next game
var external_score = 0; //simple tracking of how many correct answers are made
var isShowingCorrect = false;
document.addEventListener('click', function(e) {
	if(isShowingCorrect) { return; }
	if(e.target.className.indexOf('card') != -1){
		console.log(e.target.dataset.cardid);
		console.log(selectedIndex);
		if(e.target.dataset.cardid == selectedIndex){ //correct answer
			e.target.classList.add('correct');
			isShowingCorrect = true;
			setTimeout(function(){
				var allCards = document.getElementsByClassName('card');
				for(card=0; card < allCards.length; card++){
						allCards[card].classList.add('incorrect');
				}
				setTimeout(function(){
					allCards[0].parentNode.innerHTML = '';
					if(internal_score >= 20){
						cardsToDeal = 10;
					}
					else if(internal_score >= 10){
						cardsToDeal = 6;
					}
					else{
						cardsToDeal = 3;
					}
					gameboard(cardsToDeal);
				},1000);
			}, 2500); //game a new board
			internal_score++;
			external_score++;
			console.log(internal_score);
			document.getElementById('gamescore').innerHTML = "Score: " + external_score;
		}
		else{ //incorrect answer
			e.target.classList.add('incorrect');
			internal_score--;
		}
	}
}, false);