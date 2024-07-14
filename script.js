const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const resetScoreButton = document.getElementById('reset-score');
const undoButton = document.getElementById('undo');
const showHistoryButton = document.getElementById('show-history');
const playerXScoreText = document.getElementById('playerX-score');
const playerOScoreText = document.getElementById('playerO-score');
const playerXNameInput = document.getElementById('playerX-name');
const playerONameInput = document.getElementById('playerO-name');
const playerXColorInput = document.getElementById('playerX-color');
const playerOColorInput = document.getElementById('playerO-color');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');
const closeModal = document.getElementById('close-modal');
const modalRestartButton = document.getElementById('modal-restart');
const historyModal = document.getElementById('history-modal');
const historyList = document.getElementById('history-list');
const closeHistory = document.getElementById('close-history');

let currentPlayer = 'X';
let isGameActive = true;
let playerXScore = 0;
let playerOScore = 0;
let winningCombination = [];
let history = [];

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});
restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScore);
undoButton.addEventListener('click', undoMove);
showHistoryButton.addEventListener('click', showHistory);
closeModal.addEventListener('click', () => gameOverModal.style.display = 'none');
modalRestartButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    restartGame();
});
closeHistory.addEventListener('click', () => historyModal.style.display = 'none');

// Handle click on a cell
function handleClick(e) {
    const cell = e.target;
    if (!isGameActive) return;

    const color = currentPlayer === 'X' ? playerXColorInput.value : playerOColorInput.value;
    cell.textContent = currentPlayer;
    cell.style.color = color;
    cell.removeEventListener('click', handleClick); // Prevent further clicks
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

// Get the current player's name from input field
function getCurrentPlayerName() {
    return currentPlayer === 'X' ? playerXNameInput.value : playerONameInput.value;
}

// Check if the current player has won
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winPatterns.some(pattern => {
        if (pattern.every(index => cells[index].textContent === player)) {
            winningCombination = pattern;
            return true;
        }
        return false;
    });
}

// Check if the game is a draw
function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

// Restart the game
function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#333';
        cell.style.color = '#fff';
        cell.addEventListener('click', handleClick, { once: true });
    });
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    isGameActive = true;
    winningCombination = [];
    history = [];
}

// Reset the score
function resetScore() {
    playerXScore = 0;
    playerOScore = 0;
    playerXScoreText.textContent = playerXScore;
    playerOScoreText.textContent = playerOScore;
}

// Undo the last move
function undoMove() {
    if (history.length === 0) return;

    const lastMove = history.pop();
    cells.forEach(cell => {
        if (cell.textContent === lastMove.cell && cell.style.color === (lastMove.player === 'X' ? playerXColorInput.value : playerOColorInput.value)) {
            cell.textContent = '';
            cell.style.color = '#fff';
            cell.addEventListener('click', handleClick, { once: true });
        }
    });

    currentPlayer = lastMove.player;
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    isGameActive = true;
}

// Show the game over modal
function showGameOverModal(message) {
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex';
}

// Highlight the winning cells
function highlightWinningCells() {
    winningCombination.forEach(index => {
        cells[index].classList.add('win');
    });
}

// Update the score
function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
        playerXScoreText.textContent = playerXScore;
    } else if (winner === 'O') {
        playerOScore++;
        playerOScoreText.textContent = playerOScore;
    }
}

// Show game history
function showHistory() {
    historyList.innerHTML = '';
    history.forEach((move, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Move ${index + 1}: Player ${move.player} placed "${move.cell}"`;
        historyList.appendChild(listItem);
    });
    historyModal.style.display = 'flex';
}
