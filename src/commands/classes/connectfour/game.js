const Board = require('./board');

class Game {
  constructor() {
    this.board = new Board();
    this.currentPlayerTurn = 1;
    // The winner based on the current board state.
    //   0 - In progress
    //   1 - Player 1 wins
    //   2 - Player 2 wins
    //   3 - Game ended in a draw
    this.winner = 0;
  }

  getWinner() {
    let boardState = this.board.state,
    winner = 0,
    draw = true,
    p1RowCounts = [0,0,0,0,0,0], // Across
    p2RowCounts = [0,0,0,0,0,0];

    boardState.forEach((col, i) => {
      let p1ColCount = 0, // Up and down
      p2ColCount = 0;

      col.forEach((rowPiece, j) => {
        if (!winner) {
          if (rowPiece === 1) {
            p1ColCount++;
            p2ColCount = 0;
            p1RowCounts[j]++;
            p2RowCounts[j] = 0;
          } else if (rowPiece === 2) {
            p1ColCount = 0;
            p2ColCount++;
            p1RowCounts[j] = 0;
            p2RowCounts[j]++;
          } else {
            p1RowCounts[j] = 0;
            p2RowCounts[j] = 0;
          }

          // Check for four in a rows
          if (p1ColCount === 4 || p1RowCounts.includes(4)) {
            winner = 1;
            draw = false;
          } else if (p2ColCount === 4 || p2RowCounts.includes(4)) {
            winner = 2;
            draw = false;
          }

          if (boardState[i][j] === 0) {
            draw = false;
          }
        }
      })
    });

    let diagonalCheck = (x, y, xMult = 1, yMult = 1) => {
      let pieces = [
        boardState[x][y],
        boardState[x+(1*xMult)][y+(1*yMult)],
        boardState[x+(2*xMult)][y+(2*yMult)],
        boardState[x+(3*xMult)][y+(3*yMult)]
      ];

      if (pieces[0] === 2 && pieces[1] === 2 && pieces[2] === 2 && pieces[3] === 2) {
        winner = 2;
        draw = false;
      } else if (pieces[0] === 1 && pieces[1] === 1 && pieces[2] === 1 && pieces[3] === 1) {
        winner = 1;
        draw = false;
      }
    };

    let x, y;

    for (x = 0; x < 7; x++) {
      for (y = 0; y < 6; y++) {
        if (!winner) {
          if (x < 4 && y < 3) {
            diagonalCheck(x, y);
          } else if (x > 2 && y < 3) {
            diagonalCheck(x, y, -1);
          } else if (x < 4 && y > 2) {
            diagonalCheck(x, y, 1, -1);
          } else if (x > 2 && y > 2) {
            diagonalCheck(x, y, -1, -1);
          }
        }
      }
    }

    if (draw) {
      winner = 3;
    }

    return winner;
  }

  // Makes a move on the board based on the current player's turn.
  // Args:
  //  position -  the position to make the move at.
  makeMove(position) {
    this.board.makeMove(position, this.currentPlayerTurn);
    this.currentPlayerTurn = this.currentPlayerTurn === 1 ? 2 : 1;
    this.winner = this.getWinner();
  }

  end(winner) {
    this.winner = winner;
  }
};

module.exports = Game;
