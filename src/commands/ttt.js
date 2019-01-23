'use-strict';

const Command = require('../../lib/commands/command.js');
const request = require('request');
const path = require('path');
const fs = require('fs');
const { getOverlayedImage } = require('../../lib/utils/image-overlayer');

class TicTacToe extends Command {
  constructor(client) {
    let options = {
      name: "ttt",
      description: "Test your wits in a game of tic-tac-toe against your beloved professor.",
      format: "ttt"
    }
    super(client, options);

    this.activeGames = {};
  }

  async run(message, usingPrefix) {
    let client = this.client;
    let user = message.user;

    const msgText = message.text;
    let argOffset = (usingPrefix ? client.commandPrefix.length : 0) + this.name.length;
    const argStr = message.text.substring(argOffset + 1, msgText.length).trim();

    // This user is currently in a game
    if (this.activeGames[user]) {
      let displayNum = parseInt(argStr); // The space the user wants to make a move in (1-9)

      let moveNum = displayNum - 1; // Zero-based version (0-8)
      if (moveNum >= 0 && moveNum <= 8) {
        let userIsX = this.activeGames[user].userFirst;

        if (this.activeGames[user].board[moveNum] === 0) { // Make sure space is empty
          if (this.activeGames[user].userTurn) {
            this.moveUser(user, moveNum); // Make selected move as user

            let userOutcome = this.checkOutcome(this.activeGames[user].userFirst, this.activeGames[user].board);
            if (userOutcome === 'none') {
              this.moveAI(user); // Instruct AI to make move

              this.renderBoard(message, this.activeGames[user].board);

              let aiOutcome = this.checkOutcome(this.activeGames[user].userFirst, this.activeGames[user].board);
              if (aiOutcome !== 'none') {
                message.say((aiOutcome === 'draw') ? "It's a draw!" : "I have emerged victorious!");

                this.endGame(user);
              }
            } else {
              this.renderBoard(message, this.activeGames[user].board);

              message.say((userOutcome === 'draw') ? "It's a draw!" : "Drat! You've defeated me, <@" + user + ">.");
              this.endGame(user);
            }
          } else {
            message.say("Be patient!");
          }
        } else {
          message.say("Space " + displayNum + " is full! Please select a different space.");
        }
      } else {
        message.say("Choose a space from 1 to 9 in which to make your move.\n\n\tExample: _" + (usingPrefix ? client.commandPrefix : '') + this.name + " 4_");
      }
    }
    else { // Not in-game
      if (argStr === "X" || argStr === "x") {
        this.newGame(user, true, message); // userFirst = true
      } else if (argStr === "O" || argStr === "o" || argStr === "0") {
        this.newGame(user, false, message); // userFirst = false
      } else {
        message.say("Please specify whether you would like to play as X or O. Whoever chooses X goes first.\n\n\tExample: _" + (usingPrefix ? client.commandPrefix : '') + this.name + " X_");
      }
    }
  }

  newGame(user, userFirst, message) { // Initialize game
    this.activeGames[user] = {
      userFirst: userFirst, userTurn: userFirst,
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0] // 0 = empty, 1 = X, 2 = O
    };

    if (!userFirst) {
      this.moveAI(user); // AI makes first move
    }
    // If user goes first, do nothing further and simply wait for their move

    this.renderBoard(message, this.activeGames[user].board); // Either way, render board
  }

  endGame(user) { // Clear game data
    this.activeGames[user] = undefined;
  }

  moveAI(user) { // Instructs the AI to make the best possible move
    let userIsX = this.activeGames[user].userFirst;

    // To-do: implement AI
    let aiMove = Math.floor(Math.random() * 9);
    while(this.activeGames[user].board[aiMove] !== 0) {
      aiMove = Math.floor(Math.random() * 9);
    }

    this.activeGames[user].board[aiMove] = (userIsX ? 2 : 1);
    this.activeGames[user].userTurn = true;
  }

  moveUser(user, userMove) {
    let userIsX = this.activeGames[user].userFirst;

    this.activeGames[user].board[userMove] = (userIsX ? 1 : 2);
    this.activeGames[user].userTurn = false;
  }

  checkOutcome(userIsX, board)
  {
    let draw = true;
    for (var i = 0; i < 9; i++) {
      if (board[i] === 0)
      {
        draw = false; // If any empty spaces, not a draw
      }
    }

    if (draw) {
      return 'draw';
    } else if ((board[0] === board[1] && board[1] === board[2] && board[2] === (userIsX ? 1 : 2)) || // Top row
      (board[3] === board[4] && board[4] === board[5] && board[5] === (userIsX ? 1 : 2)) || // Middle row
      (board[6] === board[7] && board[7] === board[8] && board[8] === (userIsX ? 1 : 2)) || // Bottom row
      (board[0] === board[3] && board[3] === board[6] && board[6] === (userIsX ? 1 : 2)) || // Left column
      (board[1] === board[4] && board[4] === board[7] && board[7] === (userIsX ? 1 : 2)) || // Middle column
      (board[2] === board[5] && board[5] === board[8] && board[8] === (userIsX ? 1 : 2)) || // Right column
      (board[0] === board[4] && board[4] === board[8] && board[8] === (userIsX ? 1 : 2)) || // Diagonal 1
      (board[2] === board[4] && board[4] === board[6] && board[6] === (userIsX ? 1 : 2))) { // Diagonal 2
      return 'user'; // User win
    } else if ((board[0] === board[1] && board[1] === board[2] && board[2] === (userIsX ? 2 : 1)) || // Top row
      (board[3] === board[4] && board[4] === board[5] && board[5] === (userIsX ? 2 : 1)) || // Middle row
      (board[6] === board[7] && board[7] === board[8] && board[8] === (userIsX ? 2 : 1)) || // Bottom row
      (board[0] === board[3] && board[3] === board[6] && board[6] === (userIsX ? 2 : 1)) || // Left column
      (board[1] === board[4] && board[4] === board[7] && board[7] === (userIsX ? 2 : 1)) || // Middle column
      (board[2] === board[5] && board[5] === board[8] && board[8] === (userIsX ? 2 : 1)) || // Right column
      (board[0] === board[4] && board[4] === board[8] && board[8] === (userIsX ? 2 : 1)) || // Diagonal 1
      (board[2] === board[4] && board[4] === board[6] && board[6] === (userIsX ? 2 : 1))) { // Diagonal 2
      return 'ai'; // AI win
    } else {
      return 'none';
    }
  }

  renderBoard(message, board)
  {
    let boardImg = path.join(__dirname, '/assets/ttt/board.png');
    let xImg = path.join(__dirname, '/assets/ttt/X.png');
    let oImg = path.join(__dirname, '/assets/ttt/O.png');

    let overlays = [];

    let nextFilledSpace = 0;
    for (var i = 0; i < 9; i++) {
      if (board[i] !== 0)
      {
        overlays[nextFilledSpace] = {
          imageURL: board[i] === 1 ? xImg : oImg,
          x: 50 + (i % 3) * 150,
          y: 50 + Math.floor(i / 3) * 150,
          w: 100,
          h: 100,
        };
        nextFilledSpace++;
      }
    }

    getOverlayedImage(boardImg, { h: 500, w: 500 }, overlays).then((imageBuffer) => {
      fs.writeFile(path.join(__dirname, "/temp/ttt/board.png"), imageBuffer, () => {
        request.post({
          url: 'https://slack.com/api/files.upload',
          formData: {
            token: process.env.CLIENT_TOKEN,
            title: "The Almighty Tic-tac-toe Board",
            filename: "board.png",
            filetype: "png",
            channels: message.channel,
            file: fs.createReadStream(path.join(__dirname, "/temp/ttt/board.png")),
          },
        }, (err, res) => {
          if (err) {
            this.client.log("Error uploading image!\n" + err.stack);
          }
        });
      });
    }).catch((err) => {
      this.client.log(err.stack);
    });
  }
}
module.exports = TicTacToe;
