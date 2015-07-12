window.onload = initialise;
window.onblur = stopLightning;
window.onfocus = startLightning; 

var xmlhttp;
var subcategory;
var question;
var blanks = "";
var pressedKeys = new Array();
var wrongKeys = new Array();
var points = 0;
var wrongCount = 0;
var highScore = 0;
var hintCount = 2;
var hints = "abcdefghijklmnopqrstuvwxyz"; 

var i1, i2, i3;

l1 = document.getElementById('l1');
l2 = document.getElementById('l2');
l3 = document.getElementById('l3');

function hide() {
	document.getElementById('cover').style.display = "none";
}

function initialise() {

	hide();

	categoryContainer = document.getElementById("category");
	//categoryContainer.addEventListener("change", getQuestion, false);
	//console.log("initialised");
	document.getElementById("continue-game-btn").addEventListener("click", getQuestion, false);
	document.getElementById("new-game-btn").addEventListener("click", newGame, false);
	document.getElementById("new-game-btn-2").addEventListener("click", newGame, false);
	document.getElementById("hint-btn").addEventListener("click", getHint, false);

	document.getElementById("category").addEventListener("change", getQuestion, false);

	var options = document.getElementsByTagName('option');
	for (var i = 1; i < options.length; i++) {
		options[i].addEventListener("click", getQuestion, false);
	}
	setInterval(colorChange, 5000);
}

function startLightning() {
	i3 = setInterval(fadeInl3, 6000);
	i2 = setInterval(fadeInl2, 7000);
	i1 = setInterval(fadeInl1, 8000);
}

function stopLightning() {
	clearInterval(i1);
	clearInterval(i2);
	clearInterval(i3);
}

function fadeInl3() {
	l3.className = "visible";
	setTimeout(fadeOutl3, 1000);
}

function fadeOutl3() {
	l3.className = "hidden";
}

function fadeInl1() {
	l1.className = "visible";
	setTimeout(fadeOutl1, 1000);
}

function fadeOutl1() {
	l1.className = "hidden";
}

function fadeInl2() {
	l2.className = "visible";
	setTimeout(fadeOutl2, 1000);
}

function fadeOutl2() {
	l2.className = "hidden";
}

function colorChange() {
	catImg = document.getElementById("l");
	r = Math.floor(Math.random() * 256);
	g = Math.floor(Math.random() * 256);
	b = Math.floor(Math.random() * 256);
	catImg.style.color = "rgb(" + r + "," + g + "," + b + ")";
}

function getQuestion() {
	reset();
	window.onkeypress = keyPressed;
    category = categoryContainer.options[categoryContainer.selectedIndex].value;
    document.getElementById("category-display").innerHTML = "Category :" + category;
    document.getElementById('choice').className = "hide";
    document.getElementById('continue').className = "hide";
    document.getElementById('hint-btn').className = "";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'generator.php?category=' + category + '&subcategory=' + subcategory, true);
    xmlhttp.onreadystatechange = showQuestion;
    xmlhttp.send();
}

function showQuestion() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //console.log(xmlhttp.responseText);
        question = xmlhttp.responseText;
        showQuestionInner();
    }
}

function showQuestionInner() {
	blanks = "";
	for (var i = 0; i < question.length; i++) {
        	if (question.charAt(i) == ' ') {
        		blanks += ' ';
        	} else if (pressedKeys.indexOf(question.charAt(i).toLowerCase()) > -1) {
        		blanks += question.charAt(i);
        	} else {
        		blanks += '_'
        	}
        }
        document.getElementById('blanks').innerHTML = blanks;
        if (blanks === question) {
        	generatePoints();
        	document.getElementById('hint-btn').className = 'hide';
        	choose();
        }
}

function getHint() {
	hintCount--;

	var letter = hints.charAt(Math.floor(Math.random() * 26));

	while (pressedKeys.indexOf(letter) > -1) {
		letter = hints.charAt(Math.floor(Math.random() * 26));
	}

	press(letter);
	subtractPoints(letter);

	if (hintCount == 0) {
		document.getElementById('hint-btn').className = "hide";
	}
}

function press(key) {
	pressedKeys.push(key);
	if (question.indexOf(key) != -1 || question.indexOf(key.toUpperCase()) != -1) {
		showQuestionInner();
	} else {
		wrongHint(key);
	}
}

function wrongHint(key) {
	wrongKeys.push(key);
	document.getElementById('wrong-guess').innerHTML += key.toUpperCase() + " ";
}

function subtractPoints(key) {
	points -= (question.split(key).length - 1) * 200 * (2 - hintCount);
	console.log((question.split(key).length - 1) * 200 * (2 - hintCount));
	showPoints();
}

function generatePoints() {
	document.getElementById('points').className = "";
	points += (30 - keyPressed.length) * 100 - (wrongKeys.length * 150);
	showPoints();
	checkHighScore();
}

function showPoints() {
	document.getElementById("points").innerHTML = "POINTS : " + points;
}

function checkHighScore() {
	if (points > highScore) {
		highScore = points;
	}
	document.getElementById('high-score').innerHTML = "High Score : " + highScore;
}

function choose() {
	document.getElementById("continue").className = "";
}

function keyPressed(e) {
	key = String.fromCharCode(e.which).toLowerCase();
	if(/[^a-zA-Z0-9]/.test(key)) {
       //alert('Input is not alphanumeric');
       return ;
    }
	if (pressedKeys.indexOf(key) == -1) {
		pressedKeys.push(key);
		if (question.indexOf(key) != -1 || question.indexOf(key.toUpperCase()) != -1) {
			showQuestionInner();
		} else {
			wrongKeyPress(key);
		}
	}
}

function wrongKeyPress(key) {
	wrongKeys.push(key);
	document.getElementById('wrong-guess').innerHTML += key.toUpperCase() + " ";
	wrongCount++;
	if (wrongCount == 7) {
		endGame();
	}
	document.getElementById('lives').innerHTML = 7 - wrongCount;
	document.getElementById('hangman-image').setAttribute("src", "images/" + wrongCount + ".gif");
	if (wrongCount == 7) {
		document.getElementById('l').className = "hide";
	}
}

function endGame() {
	window.onkeypress = function () {
		return ;
	}
	document.getElementById("hint-btn").className = "hide";
	document.getElementById('blanks').innerHTML += "<br />" + question;
	document.getElementById('wrong-guess').innerHTML = "";
	document.getElementById("end-game").className = "";

}

function reset() {
	pressedKeys.length = 0;
	wrongKeys.length = 0;
	wrongCount = 0;
	hintCount = 2;
	document.getElementById('l').className = "";
	document.getElementById('lives').innerHTML = 7;
	document.getElementById('wrong-guess').innerHTML = "";
	document.getElementById("hint-btn").className = "hide";
	document.getElementById("hangman-image").setAttribute("src", "images/0.gif");
}

function newGame() {
	points = 0;
	document.getElementById('category-display').innerHTML = "";
	document.getElementById('wrong-guess').innerHTML = "";
	document.getElementById('lives').innerHTML = 6;
	document.getElementById('end-game').className = "hide";
	document.getElementById('points').className = "hide";
	document.getElementById('continue').className = "hide";
	document.getElementById('choice').className = "";
	categoryContainer.options[0].selected = true;
	document.getElementById("blanks").innerHTML = "";
	//console.log("NG");
}