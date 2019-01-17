link_names=1
'use-strict';

const Command = require('../../lib/commands/command.js');

class Ponder extends Command {
  constructor(client) {
    let options = {
      name: "botinfo",
      description: "Get info about the bot.",
      format: "bls.info"
    };
    super(client, options);
  }

  async run(message)
  {
    let client = this.client;
    let infoMessage = {
      link_names: 2,
      text: 'Authors: <@UFGTEU3TQ> and <@UFGTDHK0W>'
    }

    client.say(message, infoMessage);
  }
}
module.exports = Ponder;
