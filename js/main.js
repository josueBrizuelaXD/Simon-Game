let square1 = document.getElementById("square-1");
let square2 = document.getElementById("square-2");
let square3 = document.getElementById("square-3");
let square4 = document.getElementById("square-4");
let countDiv = document.getElementById("count-div");
let countValue = document.getElementById("count-value");
let sound1 = document.getElementById("square-1-audio");
let sound2 = document.getElementById("square-2-audio");
let sound3 = document.getElementById("square-3-audio");
let sound4 = document.getElementById("square-4-audio");
let errorSound = document.getElementById("error-sound");
let winSound = document.getElementById("win-sound");
let isGameLocked = true;
let sequenceTimer = null;
let gameTimer = null;
let strictTimer = null;
let lastPattern = 0;
let time = 1250;
let index = 0;
let sequence = [];
let count = 0;

HTMLMediaElement.prototype.stop = function () {
	this.pause();
	this.currentTime = 0;
};

var startCheckbox = document.querySelector('.js-check-change1');
var onCheckbox = document.querySelector('.js-check-change2');
var strictCheckbox = document.querySelector('.js-check-change3');

var switchery1 = new Switchery(startCheckbox, {
	color: '#F33D59'

});

var switchery2 = new Switchery(onCheckbox, {
	color: "#49B09D"
});
switchery2.disable();

var switchery3 = new Switchery(strictCheckbox, {
	color: '#ECC957'

});
switchery3.disable();


startCheckbox.onchange = function () {

	if (startCheckbox.checked) {
		switchery2.enable();
		switchery3.enable();

	} else {
		//if start is turn off, turn the other switches off too.
		switchery2.setPosition(onCheckbox.checked);
		switchery3.setPosition(strictCheckbox.checked);
		switchery2.disable();
		switchery3.disable();
		resetGame();

	}

};


onCheckbox.onchange = function () {

	if (onCheckbox.checked) {
		initGame();
	} else {
		resetGame();

		if (strictCheckbox.checked) {
			switchery3.setPosition(strictCheckbox.checked);
		}
	}


};

strictCheckbox.onchange = function () {
	
};



function resetGame() {
	clearAllTimers();
	isGameLocked = true;
	blurAllBlocks();
	stopAllSounds();
	sequenceTimer = null;
	gameTimer = null;
	strictTimer = null;
	lastPattern = 0;
	time = 1250;
	index = 0;
	sequence = [];
	count = 0;
	countDiv.innerHTML = "Count";
	countValue.innerHTML = "--";
}



function addStep() {
	count++;
	countValue.innerHTML = count;
	let num = getRandomIntInclusive(1, 4);
	sequence.push(num);


}

function playSequence() {

	var i = 0;

	sequenceTimer = setInterval(function () {
		isGameLocked = true;
		removeCursorToBlocks();
		let num = sequence[i];


		playSound(num);


		gameTimer = setTimeout(function () {
			stopBlockSounds();
			blurBlock(num);
		}, time - 150);

		i++;
		if (i === sequence.length) {
			clearInterval(sequenceTimer);

			isGameLocked = false;
			addCursorToBlocks();
			lastPattern = sequence[index];
			gameTimer = setTimeout(wrongSequence, time * 5);
		}
	}, time);
}


function initGame() {

	addStep();
	time = getTimeSpeed(count);
	playSequence();

}


function addCursorToBlocks() {
	square1.classList.remove("unclickable");
	square2.classList.remove("unclickable");
	square3.classList.remove("unclickable");
	square4.classList.remove("unclickable");
}

function removeCursorToBlocks() {
	square1.classList.add("unclickable");
	square2.classList.add("unclickable");
	square3.classList.add("unclickable");
	square4.classList.add("unclickable");
}


function playErrorSound() {
	errorSound.play();
}

function stopErrorSound() {
	errorSound.stop();
}

function flashScreen() {

	let counter = 0;
	countValue.innerHTML = "!!";

	let timer = setInterval(function () {


		if (counter % 2 === 0) {
			countValue.style.visibility = "hidden";
		} else {
			countValue.style.visibility = "visible";
		}
		counter++;

		if (counter > 4) {
			clearInterval(timer);
			countValue.innerHTML = count;
			countValue.style.visibility = "visible";
		}

	}, 500);

	console.log("counter: " + counter);

}


function stopBlockSounds() {
	sound1.stop();
	sound2.stop();
	sound3.stop();
	sound4.stop();

}

function stopAllSounds() {
	stopBlockSounds();
	stopErrorSound();
	winSound.stop();
}


function blockClicked(ob) {

	if (!isGameLocked) {
		isGameLocked = true;
		removeCursorToBlocks();
		clearTimeout(gameTimer);

		let num = parseInt(ob.id[ob.id.length - 1]);
		
//got the pattern right
		if (num === lastPattern) {
			stopBlockSounds();
			playSound(num);

			index++;
			if (index < sequence.length) {
				lastPattern = sequence[index];

			} else if (index === 20) {
				winSound.play();
				countDiv.innerHTML = "You";
				countValue.innerHTML = "Won!";

				setTimeout(function () {
					resetGame();
					initGame();
				}, 5000);

			} else {
				//add a step
				resetTracker();
				addStep();
				time = getTimeSpeed(count);

				setTimeout(
					function () {
						stopBlockSounds();
						playSequence();
					}

					, time);

			}

		} else {
			//pressed the wrong sequence
			clearTimeout(gameTimer);
			resetTracker();
			wrongSequence(num);
			console.log("wrong sequence!");
		}

		setTimeout(function () {
			blurBlock(num);
			addCursorToBlocks();
			isGameLocked = false;

		}, time);

	}

}


function resetTracker() {
	index = 0;
	lastPattern = sequence[index];
}


function getTimeSpeed(c) {

	let speed = 1250;
	if (c > 4) {
		speed = 1000;
	} else if (c > 8) {
		speed = 750;
	} else if (c > 12) {
		speed = 500;
	}

	return speed;
}

function wrongSequence(num) {

	isGameLocked = true;
	playErrorSound();
	if (num) {
		highlightBlock(num);
	}
	gameTimer = setTimeout(function () {
		stopErrorSound();

		if (num) {
			blurBlock(num);
		}

		strictTimer = setTimeout(function () {
			if (strictCheckbox.checked) {
				resetGame();
				initGame();

			} else {
				playSequence();
			}
		}, time / 4);
	}, time * 2);
	flashScreen();


}

function clearAllTimers() {
	clearInterval(sequenceTimer);
	clearTimeout(gameTimer);
}

function playSound(num) {

	switch (num) {
		case 1:


			sound1.play();
			highlightBlock(num);
			break;
		case 2:


			sound2.play();
			highlightBlock(num);
			break;
		case 3:


			sound3.play();
			highlightBlock(num);
			break;
		case 4:


			sound4.play();
			highlightBlock(num);
			break;
		default:
			break;
	}




}

function highlightBlock(num) {
	let bg = getColorBlock(num);
	switch (num) {
		case 1:



			square1.style.boxShadow = "0px 0px 30px " + bg;
			break;
		case 2:



			square2.style.boxShadow = "0px 0px 30px " + bg;
			break;
		case 3:



			square3.style.boxShadow = "0px 0px 30px " + bg;
			break;
		case 4:



			square4.style.boxShadow = "0px 0px 30px " + bg;
			break;
		default:
			break;
	}
}


function getColorBlock(num) {
	let color = null;

	switch (num) {
		case 1:
			color = "#F33D59";
			break;
		case 2:
			color = "#3197BC";
			break;
		case 3:
			color = "#49B09D";
			break;
		case 4:
			color = "#ECC957";
			break;
		default:
			break;
	}

	return color;
}

function blurBlock(num) {


	switch (num) {
		case 1:
			square1.style.boxShadow = "none";
			break;
		case 2:
			square2.style.boxShadow = "none";
			break;
		case 3:
			square3.style.boxShadow = "none";
			break;
		case 4:
			square4.style.boxShadow = "none";
			break;
		default:
			break;
	}



}

function blurAllBlocks() {
	blurBlock(1);
	blurBlock(2);
	blurBlock(3);
	blurBlock(4);
}



function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}