'use-strict';

const Command = require('../../lib/commands/command.js');
const request = require('request');
const path = require('path');
const fs = require('fs');
const { getOverlayedImage } = require('../../lib/utils/image-overlayer');

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

  async run(message, usingPrefix) {
    let client = this.client;

    let sendHat = (hatImageURL) => {
      getOverlayedImage(path.join(__dirname, '/assets/hat/scene.png'), { h: 512, w: 512 }, [{ imageURL: hatImageURL, x: 115, y: 25, w: 275, h: 175 }]).then((imageBuffer) => {
        fs.writeFile(path.join(__dirname, "/temp/hat/hat.png"), imageBuffer, () => {
          request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
              token: process.env.CLIENT_TOKEN,
              title: "Brian's Hat",
              filename: "hat.png",
              filetype: "png",
              channels: message.incoming.channel,
              file: fs.createReadStream(path.join(__dirname, "/temp/hat/hat.png")),
            },
          }, (err, res) => {
            if (err) {
              client.log("Error uploading image!\n" + err.stack);
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
      message.say("I'm already making an image. I'm only one man!");
    } else {
      busy = true;
      const messageText = message.incoming.text;

      let urlOffset = (usingPrefix ? this.client.commandPrefix.length : 0) + this.name.length;

      const imageURLStr = message.incoming.text.substring(urlOffset + 2, messageText.length - 1).trim();

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
                      message.say("That URL does not return a valid image!");
                      busy = false;
                    }
                  } else {
                    message.say("Please provide a working image URL!");
                    busy = false;
                  }
                } else {
                  message.say('Error getting image from URL!');
                  busy = false;
                }
              });
            } else {
              message.say("The image URL must be served over the HTTPS protocol!");
              busy = false;
            }
          }
        } catch (err) {
          message.say("Error creating image! Did you enter a valid URL?");
          busy = false;
        }
      } else if (message.incoming.files) {
        if (message.incoming.files[0].filetype === 'png') {
          let url = message.incoming.files[0].url_private;
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
              message.say("Error downloading attachment!");
              busy = false;
            }
          }).pipe(fs.createWriteStream(filePath));

          stream.on('finish', () => {
            sendHat(filePath);
          });
        } else {
          message.say("Sorry, I only work with hats of *lossless* compression. PNG is required!");
          busy = false;
        }
      } else {
        message.say("You need to give me a hat to wear!");
        busy = false;
      }
    }
  }
}
module.exports = Hat;
