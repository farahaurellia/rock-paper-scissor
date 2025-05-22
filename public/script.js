const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const historyScreen = document.getElementById('history-screen');

const btnPlay = document.getElementById('btn-play');
const btnHistory = document.getElementById('btn-history');
const btnBackGame = document.getElementById('btn-back-game');
const btnBackHistory = document.getElementById('btn-back-history');

const choicesButtons = gameScreen.querySelectorAll('.choices button');
const resultDiv = document.getElementById('result');
const playerChoiceSpan = document.getElementById('player-choice');
const computerChoiceSpan = document.getElementById('computer-choice');
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');

const historyBody = document.getElementById('history-body');

let playerScore = 0;
let computerScore = 0;

function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  historyScreen.classList.remove('active');

  screen.classList.add('active');
}

btnPlay.onclick = () => {
  showScreen(gameScreen);
};

btnHistory.onclick = () => {
  fetchHistory();
  showScreen(historyScreen);
};

btnBackGame.onclick = () => {
  showScreen(startScreen);
};

btnBackHistory.onclick = () => {
  showScreen(startScreen);
};

choicesButtons.forEach(button => {
  button.onclick = () => {
    playGame(button.dataset.choice);
  };
});

function playGame(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];
  let result = '';

  if (playerChoice === computerChoice) {
    result = "It's a draw!";
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    result = `You win! ${playerChoice} beats ${computerChoice}`;
    playerScore++;
  } else {
    result = `You lose! ${computerChoice} beats ${playerChoice}`;
    computerScore++;
  }

  playerChoiceSpan.textContent = playerChoice;
  computerChoiceSpan.textContent = computerChoice;

  resultDiv.textContent = result;
  playerScoreSpan.textContent = playerScore;
  computerScoreSpan.textContent = computerScore;

  fetch('/api/save-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerChoice, computerChoice, result })
  });
}

async function fetchHistory() {
  try {
    const response = await fetch('/api/history');
    if (!response.ok) throw new Error('Network response was not ok');

    const history = await response.json();

    const historyBody = document.getElementById('history-body');
    historyBody.innerHTML = '';

    if (history.length === 0) {
      historyBody.innerHTML = '<tr><td colspan="5">No history found</td></tr>';
      return;
    }

    history.forEach((game, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${game.player_choice}</td>
        <td>${game.computer_choice}</td>
        <td>${game.result}</td>
        <td>${new Date(game.created_at).toLocaleString()}</td>
      `;
      historyBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Failed to fetch history:', error);
  }
}
