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

  async run(message, usingPrefix)
  {
    let client = this.client;
    let infoMessage = {
      link_names: 2,
      text: '*Brian Bot v1.64*\n\tCreated by: <@UFGTEU3TQ>, <@UFGTDHK0W>, and <@UF7GNJVS7> \n\tSource code: https://github.com/mrniceguy127/brian-bot-v1.64'
    }

    message.say(infoMessage);
  }
}
module.exports = BotInfo;
