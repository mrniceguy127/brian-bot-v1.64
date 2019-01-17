'use-strict';

const Command = require('../../lib/commands/command.js');
const { getOverlayedImage } = require('../../lib/utils/image-overlayer');
const request = require('request');
const path = require('path');
const fs = require('fs');

let busy = false;

class Hat extends Command {
  constructor(client) {
    let options = {
      name: "hat",
      description: "Gives Brian a hat.",
      format: "hat"
    };
    super(client, options);
  }

  async run(message) {
    let client = this.client;

    let sendHat = (hatImageURL) => {
      getOverlayedImage(path.join(__dirname, '/assets/hat/scene.png'), hatImageURL, { h: 512, w: 512 }, { x: 165, y: 25, w: 175, h: 175 }).then((imageBuffer) => {
        fs.writeFile(path.join(__dirname, "/temp/hat/hat.png"), imageBuffer, () => {
          request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
              token: process.env.CLIENT_TOKEN,
              title: "Brian's Hat",
              filename: "hat.png",
              filetype: "png",
              channels: message.channel,
              file: fs.createReadStream(path.join(__dirname, "/temp/hat/hat.png")),
            },
          }, (err, res) => {
            if (err) {
              client.log("Error uploading image!", err);
            }
            busy = false;
          });
        });
      }).catch((err) => {
        client.log(err.stack);
        busy = false;
      });
    }

    if (busy) {
      client.say(message, "I'm already making an image. I'm only one man!");
    } else {
      busy = true;
      const messageText = message.text;

      let urlOffset = this.client.commandPrefix.length + this.name.length;

      const imageURLStr = message.text.substring(urlOffset + 2, messageText.length).trim();

      if (imageURLStr.length) {
        try {
          let imageURL = new URL(imageURLStr);
          if (imageURL) {
            if (imageURL.protocol === "https:") {
              request(imageURL.href, (err, res, body) => {
                if (!err) {
                  if (res.statusCode === 200) {
                    if (res.headers['content-type'].startsWith('image/')) {
                      let hatImageURL = imageURL.href;
                      sendHat(hatImageURL);
                    } else {
                      client.say(message, "That URL does not return a valid image!");
                      busy = false;
                    }
                  } else {
                    client.say(message, "Pleaase provide a working image URL!");
                    busy = false;
                  }
                } else {
                  client.say(message, 'Error getting image from URL!');
                  busy = false;
                }
              });
            } else {
              client.say(message, "The image URL must be served over the HTTPS protocol!");
              busy = false;
            }
          }
        } catch (err) {
          client.say(message, "Error creating image! Did you enter a valid URL?");
          busy = false;
        }
      } else if (message.files) {
        if (message.files[0].filetype === 'png') {
          let url = message.files[0].url_private;
          let filePath = path.join(__dirname, './temp/hat/hat-to-wear.png');

          let options = {
            method: 'GET',
            url: url,
            headers: {
              Authorization: 'Bearer ' + process.env.CLIENT_TOKEN
            }
          };

          let stream = request(options, (err, res, body) => {
            if (err) {
              client.say(message, "Error downloading attachment!");
              busy = false;
            }
          }).pipe(fs.createWriteStream(filePath));

          stream.on('finish', () => {
            sendHat(filePath);
          });
        } else {
          client.say("Sorry dude, I only work with hats of *lossless* quality. But only PNG!!!");
          busy = false;
        }
      } else {
        client.say(message, "You need to give me a hat to wear!");
        busy = false;
      }
    }
  }
}
module.exports = Hat;
