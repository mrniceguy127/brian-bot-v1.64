'use-strict';

// Info about the bot.

const Command = require('../../lib/commands/command.js');

class BotInfo extends Command {
  constructor(client) {
    let options = {
      name: "botinfo",
      description: "Get info about the bot.",
      format: "botinfo"
    };
    super(client, options);
  }

  async run(message)
  {
    let client = this.client;
    let infoMessage = {
      link_names: 2,
      text: 'Author(s): <@UFGTEU3TQ> and <@UFGTDHK0W>\nMemer(s): <@UF7GNJVS7>, <@UFGTEU3TQ>, and <@UFGTDHK0W> \nSource Code: https://github.com/mrniceguy127/brian-bot-v1.64'
    }

    client.say(message, infoMessage);
  }
}
module.exports = BotInfo;
