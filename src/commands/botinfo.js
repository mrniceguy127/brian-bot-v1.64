'use-strict';

// Info about the bot.

const Command = require('../../lib/commands/command.js');

class BotInfo extends Command {
  constructor(client) {
    let options = {
      name: "botinfo",
      description: "Get info about the bot.",
      format: "bls.botinfo"
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
module.exports = BotInfo;
