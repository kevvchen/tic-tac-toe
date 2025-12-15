function Gameboard() {
  const ROWS = 3;
  const COLS = 3;
  const board = [];

  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i].push(Cell());
    }
  }

  const markSpot = (row, col, tokenVal) => {
    const rowInvalid = row < 0 || row >= ROWS;
    const colInvalid = col < 0 || col >= COLS;

    // Check if the passed in coordinates are valid
    if (rowInvalid || colInvalid || board[row][col].getValue() !== "")
      return false;

    // Can go ahead and mark the cell
    board[row][col].markCell(tokenVal);
    return true;
  };

  // Print our board to the console to see what board looks like after every round of play
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const checkWin = () => {
    // Check if theres a winning condition based on rows
    for (let i = 0; i < ROWS; i++) {
      if (
        board[i][0].getValue() !== "" &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return true;
      }
    }
    // Check if theres a winning condition based on columns
    for (let j = 0; j < COLS; j++) {
      if (
        board[0][j].getValue() !== "" &&
        board[0][j].getValue() === board[1][j].getValue() &&
        board[1][j].getValue() === board[2][j].getValue()
      ) {
        return true;
      }
    }

    // Check main diagonal
    // We set it up this way because formatting error
    // (board[0][0].getValue() === board[1][1].getValue()) === board[2][2].getValue()
    const mainDiagonalA = board[0][0].getValue();
    const sharedDiagonal = board[1][1].getValue();
    const mainDiagonalC = board[2][2].getValue();

    if (
      mainDiagonalA !== "" &&
      mainDiagonalA === sharedDiagonal &&
      sharedDiagonal === mainDiagonalC
    )
      return true;

    // Check anti diagonal
    const antiDiagonalA = board[0][2].getValue();
    const antiDiagonalC = board[2][0].getValue();

    if (
      antiDiagonalA !== "" &&
      antiDiagonalA === sharedDiagonal &&
      sharedDiagonal === antiDiagonalC
    )
      return true;
  };

  const checkTie = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== ""));
  };

  const getBoard = () => board;

  return { markSpot, checkWin, checkTie, printBoard, getBoard };
}

/*
The Player function allows us to create players for our tic-tac-toe game
Each Player will have a token, so we know what their 'mark' is for the board
*/
function Player() {
  const createPlayer = (playerName, playerToken) => ({
    playerName,
    playerToken,
  });

  return { createPlayer };
}

/*
A cell represents one "square" on the board and can have one of:
'' (empty): Square is unmarked and up for grabs
X: Square is marked by Player1
O: Square is marked by Player2
*/
function Cell() {
  let value = "";

  // Accept's a players token to change the value of the cell
  const markCell = (playerToken) => {
    value = playerToken;
  };

  // Get the current value of the cell using closure
  const getValue = () => value;

  return { markCell, getValue };
}

/*
Execute the game 
*/
function GameController() {
  const board = Gameboard(); // Calling the Gameboard factory function. Now we have access to the objects it returns
  const player = Player();
  const player1 = player.createPlayer("Kevin", "X");
  const player2 = player.createPlayer("Polar", "O");

  const players = [];
  players.push(player1, player2);

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().playerName}'s turn.`);
  };

  const playRound = (row, col) => {
    // Mark a cell for the current players turn
    console.log(
      `Player named ${
        getActivePlayer().playerName
      } marked the cell at location (${row}, ${col})`
    );

    // Allow the current activePlayer to mark a spot
    const isMarked = board.markSpot(row, col, getActivePlayer().playerToken);

    if (!isMarked) return false;

    // Check for winning condition
    if (board.checkWin()) {
      board.printBoard();
      console.log(`${getActivePlayer().playerName} has won the game`);
      return "win";
    }

    // Check for tie condition
    if (board.checkTie()) {
      board.printBoard();
      console.log("No players have won. The game resulted in a tie");
      return "tie";
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();

    return true;
  };

  // Initial game message
  printNewRound();

  return { playRound, getBoard: board.getBoard, getActivePlayer };
}

function ScreenController() {
  const game = GameController();
  const boardContainerDiv = document.querySelector(".board-container");
  const playerTurnDiv = document.querySelector(".player-turn");
  const closeModal = document.querySelector('.close-btn')
  const displayResultText = document.querySelector('.display-results-text')

  const updateScreen = () => {
    // Clear the board
    boardContainerDiv.textContent = "";

    // Get the newest version of the board and players turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display current players turn
    playerTurnDiv.textContent = `${activePlayer.playerName}'s turn...`;

    // Render the new board on screen
    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        // Create new DOM nodes and append it as child
        const cellButton = document.createElement("button");
        // Adding a class of cell for css access
        cellButton.classList.add("cell");

        // Used to pass into playRound function
        cellButton.dataset.row = rowIdx;
        cellButton.dataset.column = colIdx;

        // Render on screen
        cellButton.textContent = cell.getValue();
        boardContainerDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow) return;
    if (!selectedColumn) return;

    const isMarked = game.playRound(selectedRow, selectedColumn);
    const activePlayer = game.getActivePlayer();

    // Check if a cell has already been marked
    if (!isMarked) {
      alert("The spot has already been taken");
      return;
    }

    if (isMarked === "win") {
      alert(`${activePlayer.playerName} has won the game`);
      return;
    }

    if (isMarked === "tie") {
      alert("The game resulted in a draw");
      return;
    }

    updateScreen();
  }
  
  boardContainerDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController();
