const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const resetScoreButton = document.getElementById('reset-score');
const undoButton = document.getElementById('undo');
const playerXScoreText = document.getElementById('playerX-score');
const playerOScoreText = document.getElementById('playerO-score');
const playerXNameInput = document.getElementById('playerX-name');
const playerONameInput = document.getElementById('playerO-name');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');
const closeModal = document.getElementById('close-modal');
const modalRestartButton = document.getElementById('modal-restart');
let currentPlayer = 'X';
let isGameActive = true;
let playerXScore = 0;
let playerOScore = 0;
let winningCombination = [];
let history = [];

const PLAYER_X_WON = 'PLAYER_X_WON';
const PLAYER_O_WON = 'PLAYER_O_WON';
const TIE = 'TIE';

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScore);
undoButton.addEventListener('click', undoMove);
closeModal.addEventListener('click', () => gameOverModal.style.display = 'none');
modalRestartButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    restartGame();
});

function handleClick(e) {
    const cell = e.target;
    if (!isGameActive) return;

    cell.textContent = currentPlayer;
    history.push({ cell, player: currentPlayer });

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

function getCurrentPlayerName() {
    return currentPlayer === 'X' ? playerXNameInput.value : playerONameInput.value;
}

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

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = 'X';
    statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    isGameActive = true;
    history = [];
}

function resetScore() {
    playerXScore = 0;
    playerOScore = 0;
    playerXScoreText.textContent = playerXScore;
    playerOScoreText.textContent = playerOScore;
    restartGame();
}

function undoMove() {
    if (history.length > 0 && isGameActive) {
        const lastMove = history.pop();
        lastMove.cell.textContent = '';
        lastMove.cell.addEventListener('click', handleClick, { once: true });
        currentPlayer = lastMove.player;
        statusText.textContent = `Player ${getCurrentPlayerName()}'s turn`;
    }
}

function highlightWinningCells() {
    winningCombination.forEach(index => {
        cells[index].classList.add('win');
    });
}

function updateScore(player) {
    if (player === 'X') {
        playerXScore++;
        playerXScoreText.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreText.textContent = playerOScore;
    }
}

function showGameOverModal(message) {
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'block';
}
