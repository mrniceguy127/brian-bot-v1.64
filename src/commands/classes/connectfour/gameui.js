const GameCanvas = require('./gamecanvas.js');
const fs = require('fs');
const path = require('path');
const request = require('request');

class GameUI {
  constructor(game, options = { assets: { scene: '', boardTile: '' }, onWinner: (winner, boardImageBuffer = null) => {} }) {
    this.game = game;
    this.onWinner = options.onWinner;
    this.assets = {
      scene: options.assets.scene || '',
      boardTile: options.assets.boardTile || ''
    }
    this.gameCanvas = new GameCanvas(this.game, this.assets);
  }

  async getBoardImageBuffer() {
    return await this.gameCanvas.getBoardImageBuffer();
  }

  requestNextMove(message) {
    if (this.game.currentPlayerTurn === 2) {
      message.say(`Make your move <@${message.incoming.user}>!`);
    }

    this.getBoardImageBuffer().then(imageBuffer => {
      fs.writeFile(path.join(__dirname, "../../temp/connectfour/connectfour.png"), imageBuffer, () => {
        request.post({
          url: 'https://slack.com/api/files.upload',
          formData: {
            token: process.env.CLIENT_TOKEN,
            title: "Connect Four",
            filename: "connectfour.png",
            filetype: "png",
            channels: message.incoming.channel,
            file: fs.createReadStream(path.join(__dirname, "../../temp/connectfour/connectfour.png")),
          },
        }, (err, res) => {
          if (err) {
            message.client.log("Error uploading image!\n" + err.stack);
          }
        });
      });
    });
  }

  makeMove(message, pos) {
    this.game.makeMove(pos);

    if (this.game.winner) {
      this.getBoardImageBuffer().then(buffer => {
        this.onWinner(this.game.winner, buffer);
      });
    } else if (this.game.currentPlayerTurn === 2) {
      this.requestNextMove(message);
    } else if (this.game.currentPlayerTurn === 1) {
      this.makeMove(message, Math.floor(Math.random() * 7));
    }
  }

  end(winner) {
    this.onWinner(winner);
    this.game.end(winner);
  }

};

module.exports = GameUI;
