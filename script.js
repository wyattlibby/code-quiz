//settings
const secondsPerQuestion = 10,
	  secondsPenalty = 5,
	  scoreBonus = 10,
	  dataName = "myHighScores",
	  maxHighScores = 3;


//application variables
var timer, timeRemaining, score, questions;


//DOM elements
const initialsInput = document.querySelector("section:nth-of-type(3) input"),
	  timerSpan = document.querySelector("header span"),
	  scoreSpan = document.querySelector("section:nth-of-type(3) span"),
	  highScoreOl = document.querySelector("section:nth-of-type(1) ol"),
	  questionSection = document.querySelector("section:nth-of-type(2)");


//event listeners
document.querySelector("section:nth-of-type(1) button").addEventListener("click", gameStart);
document.querySelector("section:nth-of-type(3) button").addEventListener("click", enterInitials);


//page load
showHighScores(getData());


//setup
function gameStart(){
	stateGame();
	questions = shuffle(storedQuestions);
	timeRemaining = secondsPerQuestion * questions.length;
	score = 0;
	timerStart();
	nextQuestion();
}


//event handlers
function enterInitials(){
	const initials = initialsInput.value,
		  highScore = {initials, score};
	var highScores = getData();
	highScores.push(highScore);
	highScores.sort((a,b) => b.score - a.score);
	highScores = highScores.slice(0, maxHighScores);
	setData(highScores);
	showHighScores(highScores);
	initialsInput.value = ""; //clear input
	statePregame();
}


//state management
function statePregame(){
	document.body.className = "pregame";
}
function stateGame(){
	document.body.className = "game";
}
function statePostgame(){
	document.body.className = "postgame";
}


//output
function showTime(){
	timerSpan.textContent = timeRemaining;
}
function showScore(){
	questionSection.style.display="none"
	scoreSpan.style.display="block"
	scoreSpan.textContent = score;
}
function showQuestion(q, a){
	console.log(q, a);
	var html = `
		<h2>${q}</h2>
	`;
	for (let ans of a){
		html += `<button>${ans}</button>`;
	}
	questionSection.style.display="block";
	questionSection.innerHTML = html;
}
function showHighScores(highScores){
	if (!highScores.length) return highScoreOl.textContent = "None yet";
	var html = "";
	for (let highScore of highScores){
		html += `<li>${highScore.initials}: ${highScore.score}</li>`;
	}
	highScoreOl.innerHTML = html;
}


//game management
function nextQuestion(){
	if (!questions.length) return gameEnd();
	const next = questions[0],
		  q = next.q,
		  a = shuffle(next.a);
	showQuestion(q, a);
	for (let button of questionSection.querySelectorAll("button")){
		button.addEventListener("click", questionAnswered);
	}
}
function questionAnswered(e){
	//e is the event object
	//e.target is the button clicked on
	//e.target.textContent is the text in that button
	const answer = e.target.textContent,
		  correctAnswer = questions[0].a[0];
	if (answer === correctAnswer){
		//yay :D
		score += scoreBonus;
	}
	else {
		//boo :(
		timeRemaining -= secondsPenalty;
	}
	questions.shift(); //remove first question
	nextQuestion();
}
function gameEnd(){
	timerStop();
	statePostgame();
	score += timeRemaining;
	showScore();
}


//timer management
function timerStart(){
	showTime();
	timer = setInterval(tick, 1000);
}
function tick(){
	timeRemaining = Math.max(0, timeRemaining-1);
	showTime();
	if (timeRemaining <= 0){
		timerStop();
		gameEnd();
	}
}
function timerStop(){
	clearInterval(timer);
	timer = null;
}


//data storage management
function getData(){
	const data = localStorage.getItem(dataName);
	if (data) return JSON.parse(data);
	return [];
}
function setData(data){
	localStorage.setItem(dataName, JSON.stringify(data));
}



//helpers (library)
function shuffle(arr){
	//clone array (no functions, nulls, or undefineds)
	const clone = JSON.parse(JSON.stringify(arr));
	//return randomly rearranged clone
	return clone.sort(() => Math.random() - 0.5);
}


//data
const storedQuestions = [
	{
		q: "1. What is 4+4?",
		a: ["8", "12", "24", "4"]
	},
	{
		q: "1. What is 20+20?",
		a: ["40", "60", "80", "100"]
	},
	{
		q: "1. What is 100+100?",
		a: ["200", "4", "70", "500"]
	},
]     
	