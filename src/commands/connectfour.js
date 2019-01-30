'use-strict';
const path = require('path');
const fs = require('fs');

const request = require('request');

const GameUI = require('./classes/connectfour/gameui');
const Game = require('./classes/connectfour/game');

const Command = require('../../lib/commands/command.js');

let busy = false;
let currentUser;
let game, gameUI;
let timeout;
let turnTimeout = 30; // seconds

class ConnectFour extends Command {
  constructor(client) {
    let options = {
      name: "connectfour",
      description: "Play connect four with me!",
      format: "connectfour <challenge/move> [movement position]"
    };
    super(client, options);
  }

  async run(message, usingPrefix) {
    if (!busy) {
      let challengeSubcommandStartRegExp = new RegExp(`^(\\s*(${this.client.commandPrefix}${this.name})\\s+(challenge)\\s*)`);
      if (message.incoming.text.search(challengeSubcommandStartRegExp.source) !== -1) {
        currentUser = message.incoming.user;
        busy = true;
        message.say("I accept your challenge, freshman...");
        game = new Game();
        gameUI = new GameUI(
          game,
          {
            assets: {
              scene: path.join(__dirname, './assets/connectfour/scene.png'),
              boardTile: path.join(__dirname, './assets/connectfour/boardtile.png')
            },
            onWinner: (winner, imageBuffer) => {
              fs.writeFile(path.join(__dirname, "/temp/connectfour/connectfour.png"), imageBuffer, () => {
                request.post({
                  url: 'https://slack.com/api/files.upload',
                  formData: {
                    token: process.env.CLIENT_TOKEN,
                    title: "Connect Four",
                    filename: "connectfour.png",
                    filetype: "png",
                    channels: message.incoming.channel,
                    file: fs.createReadStream(path.join(__dirname, "/temp/connectfour/connectfour.png")),
                  },
                }, (err, res) => {
                  if (err) {
                    client.log("Error uploading image!\n" + err.stack);
                  }
                });
              });

              if (winner === 2) {
                message.say("I've been defeated by a mere freshman...");
              } else {
                message.say("Did you really expect to win?");
              }

              busy = false;
              currentUser = undefined;
              clearTimeout(timeout);
            }
          }
        );

        gameUI.makeMove(message, Math.floor(Math.random() * 7));
        timeout = setTimeout(() => {
          gameUI.end(1);
        }, turnTimeout * 1000);
      }
    }





    let moveSubcommandStartRegExp = new RegExp(`^(\\s*(${this.client.commandPrefix}${this.name})\\s+(move)\\s+)`);
    if (message.incoming.user === currentUser && busy && message.incoming.text.search(moveSubcommandStartRegExp) !== -1) {
      let args = message.incoming.text.replace(moveSubcommandStartRegExp, "");
      let move = parseInt(args);
      if (move > 0 && move < 8) {
        gameUI.makeMove(message, move - 1);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          gameUI.end(1);
        }, turnTimeout * 1000);
      }
    }
  }
}

module.exports = ConnectFour;
