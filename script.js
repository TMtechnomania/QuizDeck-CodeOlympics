const deck = document.getElementById("deck"),
backButton = document.getElementById("back"),
nameScreen = document.getElementById("name-screen"),
modeScreen = document.getElementById("mode-screen"),
categoryScreen = document.getElementById("category-screen"),
factScreen = document.getElementById("fact-screen"),
factText = document.getElementById("fact-text"),
factTimer = document.getElementById("fact-timer"),
factTimerSlider = document.getElementById("fact-timer-slider"),
factNextBtn = document.getElementById("fact-next-btn"),
nameInput = document.getElementById("name-input"),
nameBtn = document.getElementById("name-btn"),
playerNameEl = document.getElementById("player-name");
let set = [],
i = 0,
score = 0,
done = false,
currentTimer = null,
quizTimer = null,
totalTime = 0,
playerName = "",
gameMode = "",
currentCat = 0,
qCount = 5,
qTime = 12,
hintUsed = false,
funFactText = "The first computer 'bug' was a literal moth found trapped in a relay of the Harvard Mark II computer.";
function shuffle(a) {
for (let j = a.length - 1; j > 0; j--) {
const r = Math.floor(Math.random() * (j + 1));
[a[j], a[r]] = [a[r], a[j]];
}
return a;
}
function decode(str) {
const txt = document.createElement("textarea");
txt.innerHTML = str;
return txt.value;
}
function saveName() {
playerName = nameInput.value.trim();
if (!playerName) return;
localStorage.setItem("playerName", playerName);
playerNameEl.textContent = playerName;
nameScreen.style.display = "none";
modeScreen.style.display = "block";
}
function selectMode(mode) {
gameMode = mode;
if (mode === "normal") {
qCount = 10;
qTime = 30;
} else {
qCount = 5;
qTime = 12;
}
modeScreen.style.display = "none";
categoryScreen.style.display = "block";
}
async function fetchQuestions(cat) {
let url = `https://opentdb.com/api.php?amount=${qCount}&type=multiple`;
if (cat > 0) url += `&category=${cat}`;
try {
const res = await fetch(url);
const data = await res.json();
return data.results.map((q) => {
const options = [...q.incorrect_answers.map(decode)];
const answer = Math.floor(Math.random() * 4);
options.splice(answer, 0, decode(q.correct_answer));
return {
question: decode(q.question),
options: options,
answer: answer,
};
});
} catch (err) {
return null;
}
}
async function startQuiz(cat = 0) {
currentCat = cat;
categoryScreen.style.display = "none";
factScreen.style.display = "block";
factText.innerHTML = funFactText;
factTimer.style.display = "flex";
factNextBtn.style.display = "none";
set = [];
let timerPromise = new Promise((resolve) => {
startTimerAnimation(factTimerSlider, 3, () => {
factTimer.style.display = "none";
factNextBtn.style.display = "block";
resolve();
});
});
let questionsPromise = fetchQuestions(cat).then((questions) => {
set = questions;
});
await Promise.all([timerPromise, questionsPromise]);
if (!set || set.length === 0) {
factText.innerHTML = "Error fetching questions. Please go back and try again.";
factNextBtn.style.display = "none";
backButton.style.display = "block";
}
}
function proceedToQuiz() {
factScreen.style.display = "none";
deck.style.display = "block";
backButton.style.display = "block";
deck.innerHTML = "";
i = 0;
score = 0;
totalTime = 0;
hintUsed = false;
done = false;
stopTimer();
quizTimer = setInterval(() => {
totalTime++;
}, 1000);
for (let k = 0; k < 3; k++) appendCard();
arrange();
}
function appendCard() {
if (i >= set.length && !done) {
appendScoreCard();
done = true;
return;
}
if (i >= set.length) return;
const q = set[i++];
const c = document.createElement("div");
c.className = "card";
let hintHTML = gameMode === "normal" ? `<button class="hint-btn" onclick="useHint(this, ${q.answer})">50/50</button>` : "";
c.innerHTML = `<div><div class="timer"><div class="timer-slider"></div><div class="timer-text">${qTime}</div></div><h3>${q.question}</h3></div><div>${hintHTML}<div class="options"></div><div class="meta">Question ${i} of ${set.length}</div></div>`;
q.options.forEach((o, n) => {
const b = document.createElement("button");
b.className = "option-btn";
b.textContent = o;
b.onclick = (e) => checkAns(e, q.answer, c, n);
c.querySelector(".options").appendChild(b);
});
deck.appendChild(c);
}
function useHint(btn, ans) {
if (hintUsed) return;
hintUsed = true;
btn.disabled = true;
const card = btn.closest(".card");
const btns = card.querySelectorAll(".option-btn");
let wrong = [];
btns.forEach((b, ix) => {
if (ix !== ans) wrong.push(b);
});
shuffle(wrong);
wrong[0].disabled = true;
wrong[1].disabled = true;
}
function checkAns(e, ans, card, n) {
if (!card.classList.contains("pos-top")) return;
stopTimer();
const btns = card.querySelectorAll(".option-btn");
btns.forEach((b) => {
b.disabled = true;
});
const slider = card.querySelector(".timer-slider");
if (slider) {
slider.style.transition = "none";
slider.style.opacity = "0.4";
}
btns.forEach((b, ix) => {
if (ix === ans) b.classList.add("correct");
if (ix === n && n !== ans) b.classList.add("wrong");
});
if (n === ans) score++;
setTimeout(() => {
card.classList.add("fly-up");
card.addEventListener("transitionend",() => {
card.remove();
appendCard();
arrange();
},{ once: true });
}, 300);
}
function appendScoreCard() {
const r = document.createElement("div");
r.className = "card";
r.id = "scoreCard";
r.innerHTML = `<div id="close" onclick="resetGame()">×</div><h3>Your Score</h3><div class="score-display"><span class="score-number" id="scoreNum"></span><span class="score-percent" id="scorePerc"></span><div class="score-message" id="scoreMsg"></div><div id="high-score"></div></div><button class="btn" onclick="resetGame()">Play Again</button>`;
deck.append(r);
}
function preloadFunFact() {
fetch("https://programming-quotes-api.herokuapp.com/quotes/random")
.then((res) => res.json())
.then((data) => {
funFactText = `"${data.en}"<br><br><em>- ${data.author}</em>`;
})
.catch(() => {});
}
function dismissCard(el) {
const card = el.closest(".card");
if (!card || !card.classList.contains("pos-top")) return;
stopTimer();
card.classList.add("fly-up");
card.addEventListener("transitionend",() => {
card.remove();
arrange();
},{ once: true });
}
function arrange() {
stopTimer();
const cards = [...deck.querySelectorAll(".card")];
cards.forEach((c) =>
c.classList.remove("pos-top", "pos-mid", "pos-bottom")
);
if (cards[0]) {
cards[0].classList.add("pos-top");
if (cards[0].id === "scoreCard") {
clearInterval(quizTimer);
const perc = Math.round((score / set.length) * 100);
let message = perc === 100 ? "Perfect Score! 🤩" : perc >= 80 ? "Excellent! 🔥" : perc >= 60 ? "Great job! 👍" : perc >= 40 ? "Nice try!" : perc >= 20 ? "Good effort!" : "Keep practicing! 📚";
document.getElementById("scoreNum").textContent = `${score} / ${set.length}`;
document.getElementById("scorePerc").textContent = `(${perc}%) in ${totalTime}s`;
document.getElementById("scoreMsg").textContent = message;
saveAndShowHighScore();
} else if (cards[0].querySelector(".timer")) {
startTimerAnimation(cards[0].querySelector(".timer-slider"),qTime,() => { handleTimeOut(cards[0]); },cards[0].querySelector(".timer-text"));
}
}
if (cards[1]) cards[1].classList.add("pos-mid");
if (cards[2]) cards[2].classList.add("pos-bottom");
}
function saveAndShowHighScore() {
const key = `highScore_${gameMode}_${currentCat}`;
const old = JSON.parse(localStorage.getItem(key));
let msg = "No high score yet for this mode.";
if (old) {
msg = `Top: ${old.name} (${old.score}/${qCount} in ${old.time}s)`;
}
if (!old || score > old.score || (score === old.score && totalTime < old.time)) {
msg = `New High Score!`;
localStorage.setItem(key,JSON.stringify({name: playerName,score: score,time: totalTime,}));
}
document.getElementById("high-score").textContent = msg;
}
function resetGame() {
deck.style.display = "none";
categoryScreen.style.display = "block";
backButton.style.display = "none";
stopTimer();
}
function startTimerAnimation(slider, time, onEnd, textEl = null) {
let timeLeft = time;
if (textEl) textEl.textContent = timeLeft;
if (!slider) return;
slider.style.transition = "none";
slider.style.transform = "scaleX(1)";
void slider.offsetWidth;
slider.style.transition = `transform ${time}s linear`;
slider.style.transform = "scaleX(0)";
currentTimer = setInterval(() => {
timeLeft--;
if (textEl) textEl.textContent = timeLeft;
if (timeLeft <= 0) {
stopTimer();
onEnd();
}
}, 1000);
}
function stopTimer() {
clearInterval(currentTimer);
currentTimer = null;
}
function handleTimeOut(card) {
if (!card || !card.classList.contains("pos-top")) return;
stopTimer();
const btns = card.querySelectorAll(".option-btn");
const cardIndex = i - deck.querySelectorAll(".card").length;
if (set[cardIndex]) {
const q = set[cardIndex];
btns.forEach((b, ix) => {
b.disabled = true;
if (ix === q.answer) b.classList.add("correct");
});
}
setTimeout(() => {
card.classList.add("fly-up");
card.addEventListener("transitionend",() => {
card.remove();
appendCard();
arrange();
},{ once: true });
}, 300);
}
(function init() {
preloadFunFact();
const name = localStorage.getItem("playerName");
if (name) {
playerName = name;
nameInput.value = name;
}
nameBtn.addEventListener("click", saveName);
backButton.addEventListener("click", resetGame);
})();