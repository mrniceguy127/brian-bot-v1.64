'use-strict';

// Bot help command.

const Command = require('../../lib/commands/command.js');

class BotHelp extends Command {
  constructor(client) {
    let options = {
      name: "bothelp",
      description: "See the bot's commands.",
      format: "bothelp"
    };
    super(client, options);
  }

  async run(message, usingPrefix)
  {
    let client = this.client;

    let helpMessage = '*Brian Bot v1.64*\n'; // Message header.

    Array.from(client.commands.values()).forEach(command => {
      helpMessage += `\t*${command.name}* - _${command.description}_\n`; // Message formatting.
    });

    client.say(message, helpMessage);
  }
}
module.exports = BotHelp;
