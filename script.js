// Select DOM elements
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const settingsModal = document.getElementById('settingsModal');
const playerXNameInput = document.getElementById('playerXName');
const playerONameInput = document.getElementById('playerOName');
const playerXColorInput = document.getElementById('playerXColor');
const playerOColorInput = document.getElementById('playerOColor');
const themeSelect = document.getElementById('themeSelect');
const soundEffectsCheckbox = document.getElementById('soundEffects');
const highlightWinsCheckbox = document.getElementById('highlightWins');
const startGameButton = document.getElementById('startGame');
const resetScoreButton = document.getElementById('resetScore');
const showHistoryButton = document.getElementById('showHistory');
const settingsToggleButton = document.getElementById('settingsToggle');
const closeModalButton = document.getElementById('closeModal');
const closeHistoryModalButton = document.getElementById('closeHistoryModal');
const closeSettingsModalButton = document.getElementById('closeSettingsModal');
const playAgainButton = document.getElementById('playAgain');
const toggleThemeButton = document.getElementById('toggleTheme');

let currentPlayer = 'X';
let playerXScore = 0;
let playerOScore = 0;
let winningCombination = [];
let history = [];
let audio = new Audio('win-sound.mp3');

// Initialize the game
function initializeGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
        cell.addEventListener('click', handleClick);
    });
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
}

// Handle cell click
function handleClick(event) {
    const cell = event.target;
    if (cell.textContent || checkWin('X') || checkWin('O')) return;

    cell.textContent = currentPlayer;
    cell.style.color = getCurrentPlayerColor();

    if (checkWin(currentPlayer)) {
        updateScore(currentPlayer);
        highlightWinningCells();
        showGameOverModal(`${getCurrentPlayerName()} Wins!`);
        playSound();
        history.push({ player: getCurrentPlayerName(), cell: `Cell ${cell.dataset.index}` });
    } else if (isDraw()) {
        showGameOverModal('It\'s a Draw!');
    } else {
        switchPlayer();
    }
}

// Play sound effect
function playSound() {
    if (soundEffectsCheckbox.checked) {
        audio.play();
    }
}

// Get current player name
function getCurrentPlayerName() {
    return currentPlayer === 'X' ? playerXNameInput.value : playerONameInput.value;
}

// Get current player color
function getCurrentPlayerColor() {
    return currentPlayer === 'X' ? playerXColorInput.value : playerOColorInput.value;
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
}

// Check for a win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return cells[a].textContent === player &&
               cells[b].textContent === player &&
               cells[c].textContent === player;
    });
}

// Check for a draw
function isDraw() {
    return [...cells].every(cell => cell.textContent);
}

// Highlight winning cells
function highlightWinningCells() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        if (cells[a].textContent === currentPlayer &&
            cells[b].textContent === currentPlayer &&
            cells[c].textContent === currentPlayer) {
            cells[a].classList.add('win');
            cells[b].classList.add('win');
            cells[c].classList.add('win');
            winningCombination = [a, b, c];
            return true;
        }
        return false;
    });
}

// Show game over modal
function showGameOverModal(message) {
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex';
}

// Update the score
function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
    } else {
        playerOScore++;
    }
}

// Reset the game and scores
function resetGame() {
    initializeGame();
    startGameButton.disabled = false;
    playerXScore = 0;
    playerOScore = 0;
    updateScoreDisplay();
}

// Update the score display
function updateScoreDisplay() {
    document.getElementById('playerXScore').textContent = `Player X: ${playerXScore}`;
    document.getElementById('playerOScore').textContent = `Player O: ${playerOScore}`;
}

// Show game history
function showHistory() {
    historyList.innerHTML = history.map(entry => `<li>${entry.player} - ${entry.cell}</li>`).join('');
    historyModal.style.display = 'flex';
}

// Show settings modal
function showSettings() {
    settingsModal.style.display = 'flex';
}

// Close modals
function closeModals() {
    gameOverModal.style.display = 'none';
    historyModal.style.display = 'none';
    settingsModal.style.display = 'none';
}

// Event listeners
startGameButton.addEventListener('click', initializeGame);
resetScoreButton.addEventListener('click', resetGame);
showHistoryButton.addEventListener('click', showHistory);
settingsToggleButton.addEventListener('click', showSettings);
closeModalButton.addEventListener('click', closeModals);
closeHistoryModalButton.addEventListener('click', closeModals);
closeSettingsModalButton.addEventListener('click', closeModals);
playAgainButton.addEventListener('click', () => {
    initializeGame();
    gameOverModal.style.display = 'none';
});
toggleThemeButton.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'default' ? 'dark' : 'default';
});

// Initialize game on load
initializeGame();
