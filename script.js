// Select DOM elements
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const playerXNameInput = document.getElementById('playerXName');
const playerONameInput = document.getElementById('playerOName');
const playerXColorInput = document.getElementById('playerXColor');
const playerOColorInput = document.getElementById('playerOColor');
const startGameButton = document.getElementById('startGame');
const resetScoreButton = document.getElementById('resetScore');
const showHistoryButton = document.getElementById('showHistory');
const closeModalButton = document.getElementById('closeModal');
const closeHistoryModalButton = document.getElementById('closeHistoryModal');
const playAgainButton = document.getElementById('playAgain');

let currentPlayer = 'X';
let isGameActive = true;
let playerXScore = 0;
let playerOScore = 0;
let history = [];
let winningCombination = [];

// Initialize the game
function initializeGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#666';
        cell.style.color = '#000';
        cell.classList.remove('win');
        cell.addEventListener('click', handleClick, { once: true });
    });
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    isGameActive = true;
    winningCombination = [];
    history = [];
    updateScoreDisplay();
}

// Get the current player's name from input field
function getCurrentPlayerName() {
    return currentPlayer === 'X' ? playerXNameInput.value : playerONameInput.value;
}

// Handle cell clicks
function handleClick(event) {
    const cell = event.target;

    if (!isGameActive || cell.textContent) return;

    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? playerXColorInput.value : playerOColorInput.value;
    history.push({ cell: cell.textContent, player: currentPlayer });

    if (checkWin(currentPlayer)) {
        showGameOverModal(`${getCurrentPlayerName()} wins!`);
        highlightWinningCells();
        updateScore(currentPlayer);
        isGameActive = false;
    } else if (isDraw()) {
        showGameOverModal('Draw!');
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    }
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

// Close modals
function closeModals() {
    gameOverModal.style.display = 'none';
    historyModal.style.display = 'none';
}

// Event listeners
startGameButton.addEventListener('click', initializeGame);
resetScoreButton.addEventListener('click', resetGame);
showHistoryButton.addEventListener('click', showHistory);
closeModalButton.addEventListener('click', closeModals);
closeHistoryModalButton.addEventListener('click', closeModals);
playAgainButton.addEventListener('click', () => {
    initializeGame();
    gameOverModal.style.display = 'none';
});

// Initialize game on load
initializeGame();
