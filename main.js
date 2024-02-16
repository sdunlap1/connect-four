/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//Defining the Game class
class Game {
  //constructor to initiate the game
  constructor(player1Color = "red", player2Color = "black") {
    this.width = 7; //sets width
    this.height = 6; //sets height
    this.board = []; //initialize with empty array
    this.currPlayer = 1; //starts with player one
    this.player1Color = player1Color; //Player 1's color
    this.player2Color = player2Color; //Player 2's color
    this.makeBoard(); //initialize the board
    this.makeHtmlBoard(); //Creates the board in the browser
  }
  //The method to create the JS board structure
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      //Loop thru the rows based on height
      this.board.push(Array.from({ length: this.width })); //Push an array to a row in the board
    }
  }
  //The method to create the HTML table, rows and column tops
  makeHtmlBoard() {
    const board = document.getElementById("board"); //Selects the board element
    board.innerHTML = ""; //Clears the existing board to restart the game

    //This creates the top row for column clicks
    const top = document.createElement("tr"); //Creates a table row
    top.setAttribute("id", "column-top"); //Sets id for styling
    top.addEventListener("click", this.handleClick.bind(this)); //Attach an event listner to the Game instance

    //Creat clickable cells for each column in the top row
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td"); //Create a table cell
      headCell.setAttribute("id", x); //Set the cell's ID to its column index
      top.append(headCell); //Append the cell to the top row
    }
    board.append(top); //Append the top row to the board

    //Creat the main part of the board with rows and cells
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr"); //Create a table row

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td"); //Create table cells
        cell.setAttribute("id", `${y}-${x}`); //Set the cell's ID using row and column indices
        row.append(cell); //Append the cell to the current row
      }
      board.append(row); //Appent the current row to the board
    }
  }
  //Method to find the top empty cell in a column
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      //Starts from the bottom row and goes up
      if (!this.board[y][x]) {
        //If a cell is falsy, it's empty
        return y; //Returns the y index of the empty cell
      }
    }
    return null; //If column is full return null
  }
  //Method to update the DOM
  placeInTable(y, x) {
    const piece = document.createElement("div"); //Create a new div for the piece
    piece.classList.add("piece"); //Add classes for styling
    piece.style.backgroundColor =
      this.currPlayer === 1 ? this.player1Color : this.player2Color; // Use player color
    piece.style.top = -50 * (y + 2); //Set top position for animation

    const spot = document.getElementById(`${y}-${x}`); //Select the cell where the piece will be placed
    spot.append(piece); //Appends piece to cell
  }

  //Method to end game with msg
  endGame(msg) {
    alert(msg); //Display the alert
  }
  //Method to handle click events on the top row
  handleClick(evt) {
    const x = +evt.target.id; // Get the x index (column) from the clicked cell's ID
    const y = this.findSpotForCol(x); // Find the top empty spot in that column
    if (y === null) {
      return; // If the column is full, ignore the click
    }

    this.board[y][x] = this.currPlayer; // Update the board array with the current player's number
    this.placeInTable(y, x); // Place the piece in the table

    // Check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`); // Announce win and return
    }

    // Check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!"); // Announce tie and return
    }

    // Switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1; // Toggle between player 1 and 2
  }

  checkForWin() {
    const _win = (cells) =>
      // Check four cells to see if they're all the current player's
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Define "check list" for winning conditions: horizontal, vertical, diagonal right, and diagonal left
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // Check each winning condition to see if any are met
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true; // A win was found
        }
      }
    }

    return false; // No win found
  }
}
// Function to start a new game with the chosen colors
function startNewGame() {
  const player1Color = document.getElementById("player1-color").value;
  const player2Color = document.getElementById("player2-color").value;

  // Clear the board HTML and start a new game instance
  new Game(player1Color, player2Color);
}

// Event listener for the start game button
document.getElementById("start-game").addEventListener("click", startNewGame);

