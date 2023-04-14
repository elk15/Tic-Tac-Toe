const Player = (mark) => {
    let points = 0;
    const getMark = () => mark;
    const getPoints = () => points;
    const addPoint = () => {
        points += 1;
    };
    return { getMark, getPoints, addPoint };
};

const playerX = Player('X');
const playerO = Player('O');

const gameBoard = (() => {
    const board = [['', '', ''],
        ['', '', ''],
        ['', '', '']];
    let playerTurn = playerX;
    const switchPlayerTurn = () => {
        playerTurn = playerTurn.getMark() == 'X' ? playerO : playerX;
    };
    const getCurrentMark = () => playerTurn.getMark();
    const checkForWin = (player) => {
        // check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] == player.getMark() && board[row][0] == board[row][1]
                && board[row][1] == board[row][2]) {
                return true;
            }
        }
        // check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] == player.getMark() && board[0][col] == board[1][col]
                && board[1][col] == board[2][col]) {
                return true;
            }
        }
        // check diagonals
        if (board[0][0] == player.getMark() && board[0][0] == board[1][1]
            && board[1][1] == board[2][2]) {
            return true;
        }
        if (board[0][2] == player.getMark() && board[0][2] == board[1][1]
            && board[1][1] == board[2][0]) {
            return true;
        }
        return false;
    };
    const isSpaceLeft = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] == '') {
                    return true;
                }
            }
        }
        return false;
    };
    const resetBoard = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                board[row][col] = '';
            }
        }
    };

    const checkIfGameOver = () => {
        if (!isSpaceLeft() || checkForWin(playerTurn)) {
            return true;
        }
        return false;
    };

    const finishGame = () => {
        if (!isSpaceLeft()) {
            return "It's a tie!";
        }
        if (checkForWin(playerX)) {
            playerX.addPoint();
            return 'Player X wins!';
        }
        if (checkForWin(playerO)) {
            playerO.addPoint();
            return 'Player O wins!';
        }
    };

    const makeMove = (row, col) => {
        if (board[row][col] != 'X' && board[row][col] != 'O') {
            board[row][col] = getCurrentMark();
        }
    };

    return {
        getCurrentMark,
        makeMove,
        checkIfGameOver,
        finishGame,
        resetBoard,
        switchPlayerTurn,
    };
})();

const displayController = (() => {
    const squares = document.querySelectorAll('.square');
    const playerXPoints = document.querySelector('.playerX-points');
    const playerOPoints = document.querySelector('.playerO-points');
    const gameEnd = document.querySelector('.game-end');
    const playAgainBtn = document.querySelector('.play-again');
    const endMessage = document.querySelector('.end-message');
    const overlay = document.querySelector('.overlay');

    const clearDisplay = () => {
        squares.forEach((square) => {
            square.innerHTML = '';
        });
    };
    const displayPlayerPoints = () => {
        playerXPoints.textContent = playerX.getPoints();
        playerOPoints.textContent = playerO.getPoints();
    };
    const endGameDisplay = (message) => {
        displayPlayerPoints();
        gameEnd.classList.remove('hidden');
        overlay.classList.remove('hidden');
        endMessage.textContent = message;
    };
    const displayMarks = () => {
        squares.forEach((square) => {
            square.addEventListener('click', (e) => {
                const { col } = e.target.dataset;
                const { row } = e.target.dataset;
                gameBoard.makeMove(row, col);
                const currentMark = gameBoard.getCurrentMark();

                const newSpan = document.createElement('span');
                newSpan.classList.add(currentMark == 'X' ? 'red' : 'green');
                newSpan.textContent = currentMark;
                square.appendChild(newSpan);

                if (gameBoard.checkIfGameOver()) {
                    const message = gameBoard.finishGame();
                    endGameDisplay(message);
                }
                gameBoard.switchPlayerTurn();
            });
        });
    };

    const playAgainController = () => {
        playAgainBtn.addEventListener('click', () => {
            gameBoard.resetBoard();
            clearDisplay();
            gameEnd.classList.add('hidden');
            overlay.classList.add('hidden');
        });
    };

    return {
        displayMarks,
        playAgainController,
    };
})();

displayController.displayMarks();
displayController.playAgainController();
