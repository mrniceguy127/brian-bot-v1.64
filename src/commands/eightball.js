'use-strict';

// 8-ball command.

const fs = require('fs');
const path = require('path');
const request = require('request');

const Command = require('../../lib/commands/command.js');

class EightBall extends Command {
  constructor(client) {
    let options = {
      name: "8ball",
      description: "Have Brian give the answers you are looking for.",
      format: "8ball <questions>"
    };
    super(client, options);
  }

  async run(message, usingPrefix)
  {
    let client = this.client;

    let question = message.incoming.text.replace(new RegExp(`${usingPrefix ? client.commandPrefix : ''}${this.name}\s*`), "");

    if (question) {
      let images = fs.readdirSync(path.join(__dirname, './assets/eightball'));
      let imageToSend = images[Math.floor(Math.random() * images.length)];
      request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
          token: process.env.CLIENT_TOKEN,
          title: "Brian's Hat",
          filename: "hat.png",
          filetype: "png",
          channels: message.incoming.channel,
          file: fs.createReadStream(path.join(__dirname, `./assets/eightball/${imageToSend}`))
        },
      }, (err, res) => {
        if (err) {
          client.log("Error uploading image!\n" + err.stack);
        }
      });
    } else {
      message.say("I can only answer your question if you have one...");
    }
  }
}
module.exports = EightBall;
