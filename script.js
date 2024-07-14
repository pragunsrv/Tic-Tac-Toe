document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('statusText');
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const playAgainButton = document.getElementById('playAgain');
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    const showHistoryButton = document.getElementById('showHistory');
    const closeHistoryModalButton = document.getElementById('closeHistoryModal');
    const settingsModal = document.getElementById('settingsModal');
    const settingsToggleButton = document.getElementById('settingsToggle');
    const closeSettingsModalButton = document.getElementById('closeSettingsModal');
    const applySettingsButton = document.getElementById('applySettings');
    const replayModal = document.getElementById('replayModal');
    const replayGameButton = document.getElementById('replayGame');
    const closeReplayModalButton = document.getElementById('closeReplayModal');
    const replayLastGameButton = document.getElementById('replayLastGame');
    const undoMoveButton = document.getElementById('undoMove');
    const startGameButton = document.getElementById('startGame');
    const resetScoreButton = document.getElementById('resetScore');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const playerXColorInput = document.getElementById('playerXColor');
    const playerOColorInput = document.getElementById('playerOColor');
    const playerXAvatarInput = document.getElementById('playerXAvatar');
    const playerOAvatarInput = document.getElementById('playerOAvatar');
    const themeSelect = document.getElementById('themeSelect');
    const soundEffectsCheckbox = document.getElementById('soundEffects');
    const highlightWinsCheckbox = document.getElementById('highlightWins');
    const enableAnimationsCheckbox = document.getElementById('enableAnimations');
    const animationSpeedRange = document.getElementById('animationSpeed');

    let boardState = Array(9).fill(null);
    let currentPlayer = 'X';
    let history = [];
    let moveHistory = [];
    let isGameOver = false;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    function checkWinner() {
        for (const [a, b, c] of winningCombinations) {
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a];
            }
        }
        return boardState.includes(null) ? null : 'Tie';
    }

    function updateStatus() {
        const winner = checkWinner();
        if (winner) {
            isGameOver = true;
            if (winner === 'Tie') {
                gameOverMessage.textContent = "It's a tie!";
            } else {
                gameOverMessage.textContent = `${currentPlayer} wins!`;
                if (highlightWinsCheckbox.checked) {
                    highlightWinningCells(winner);
                }
            }
            gameOverModal.style.display = 'block';
            if (soundEffectsCheckbox.checked) {
                new Audio('win-sound.mp3').play();
            }
        } else {
            statusText.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function highlightWinningCells(winner) {
        for (const [a, b, c] of winningCombinations) {
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                break;
            }
        }
    }

    function makeMove(index) {
        if (isGameOver || boardState[index]) return;

        boardState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        moveHistory.push(index);
        updateStatus();
        if (currentPlayer === 'X') {
            currentPlayer = 'O';
        } else {
            currentPlayer = 'X';
        }
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        makeMove(index);
    }

    function startNewGame() {
        boardState = Array(9).fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
        isGameOver = false;
        moveHistory = [];
    }

    function resetScore() {
        history = [];
        updateHistoryModal();
    }

    function showHistory() {
        updateHistoryModal();
        historyModal.style.display = 'block';
    }

    function updateHistoryModal() {
        historyList.innerHTML = history.map(game => `<li>${game}</li>`).join('');
    }

    function closeHistoryModal() {
        historyModal.style.display = 'none';
    }

    function openSettings() {
        settingsModal.style.display = 'block';
    }

    function closeSettingsModal() {
        settingsModal.style.display = 'none';
    }

    function applySettings() {
        document.body.dataset.theme = themeSelect.value;
        // Apply color and avatar settings here
        closeSettingsModal();
    }

    function undoMove() {
        const lastMove = moveHistory.pop();
        if (lastMove !== undefined) {
            boardState[lastMove] = null;
            cells[lastMove].textContent = '';
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }

    function replayLastGame() {
        // Logic to replay the last game
        replayModal.style.display = 'none';
    }

    function closeReplayModal() {
        replayModal.style.display = 'none';
    }

    function playAgain() {
        startNewGame();
        gameOverModal.style.display = 'none';
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    startGameButton.addEventListener('click', startNewGame);
    resetScoreButton.addEventListener('click', resetScore);
    showHistoryButton.addEventListener('click', showHistory);
    closeHistoryModalButton.addEventListener('click', closeHistoryModal);
    settingsToggleButton.addEventListener('click', openSettings);
    closeSettingsModalButton.addEventListener('click', closeSettingsModal);
    applySettingsButton.addEventListener('click', applySettings);
    undoMoveButton.addEventListener('click', undoMove);
    replayGameButton.addEventListener('click', () => replayModal.style.display = 'block');
    replayLastGameButton.addEventListener('click', replayLastGame);
    closeReplayModalButton.addEventListener('click', closeReplayModal);
    playAgainButton.addEventListener('click', playAgain);
});
