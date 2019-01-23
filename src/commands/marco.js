'use-strict';

const Command = require('../../lib/commands/command.js');

class Marco extends Command {
  constructor(client) {
    let options = {
      name: "marco",
      description: "Use this to locate Brian.",
      format: "marco"
    };
    super(client, options);
  }

  async run(message, usingPrefix)
  {
    let client = this.client;

    message.say("Polo.");
  }
}
module.exports = Marco;
