'use-strict';

const Command = require('../../lib/commands/command.js');

class Brible extends Command {
  constructor(client) {
    let options = {
      name: "brible",
      description: "Read the Brible.",
      format: "brible"
    };
    super(client, options);
  }

  async run(message, usingPrefix)
  {
    message.say("Behold.\n\n<https://github.com/mrniceguy127/brian-bot-v1.64/wiki>");
  }
}
module.exports = Brible;
