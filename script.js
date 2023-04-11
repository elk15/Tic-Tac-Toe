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
    let playerTurn = 'X';
    let gameResult = '';
    const switchPlayerTurn = () => (playerTurn == 'X' ? 'O' : 'X');
    const checkForWin = (mark) => {
        // check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] == mark && board[row][0] == board[row][1]
                && board[row][1] == board[row][2]) {
                return true;
            }
        }
        // check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] == mark && board[0][col] == board[1][col]
                && board[1][col] == board[2][col]) {
                return true;
            }
        }
        // check diagonals
        if (board[0][0] == mark && board[0][0] == board[1][1]
            && board[1][1] == board[2][2]) {
            return true;
        }
        if (board[0][2] == mark && board[0][2] == board[1][1]
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

    const checkForGameEnd = () => {
        if (checkForWin('X')) {
            return 1;
        } if (checkForWin('O')) {
            return 2;
        } if (!isSpaceLeft()) {
            return 0;
        }
        return 'continue';
    };
    const makeMove = (row, col) => {
        if (board[row][col] != 'X' && board[row][col] != 'O') {
            board[row][col] = playerTurn;
            playerTurn = switchPlayerTurn();
            gameResult = checkForGameEnd();
            if (gameResult != 'continue') {
                resetBoard();
                return gameResult;
            }
            return board[row][col];
        }
    };

    return {
        makeMove,
    };
})();

const displayController = (() => {
    const squares = document.querySelectorAll('.square');
    const clearDisplay = () => {
        squares.forEach((square) => {
            square.innerHTML = '';
        });
    };
    const displayMarks = () => {
        squares.forEach((square) => {
            square.addEventListener('click', (e) => {
                const { col } = e.target.dataset;
                const { row } = e.target.dataset;
                const result = gameBoard.makeMove(row, col);
                if (result == 'X' || result == 'O') {
                    const newSpan = document.createElement('span');
                    newSpan.classList.add(result == 'X' ? 'red' : 'green');
                    newSpan.textContent = result;
                    square.appendChild(newSpan);
                } else {
                    clearDisplay();
                }
            });
        });
    };

    return {
        displayMarks,
    };
})();

displayController.displayMarks();
