'use-strict';

class Client {
  constructor(slackBot, slackController, commandPrefix) {
    this.slackBot = slackBot;
    this.slackController = slackController;
    this.commandPrefix = commandPrefix;
    this.commands = new Map();
  }

  loadCommands(commandsPath) {
    const getCommandClasses = require('../utils/get-command-classes');
    let commandClasses = getCommandClasses(commandsPath);
    commandClasses.forEach((commandClass) => {
      let command = new commandClass(this);
      this.commands.set(command.name, command);
    });
  }

  parseCommand(messageText) {
    let foundCommand = undefined;
    Array.from(this.commands.values()).forEach((command) => {
      let commandCallPrefix = `${this.commandPrefix}${command.name}`;
      let commandRegExp = new RegExp(`${commandCallPrefix}\\s+`);
      if (messageText.search(commandRegExp) !== -1 || commandCallPrefix.length === messageText.trim().length) {
        foundCommand = command;
      }
    });

    return foundCommand;
  }

  listenForCommands(messageTypes = [ 'direct_message', "ambient" ]) {
    this.slackController.hears(".*", messageTypes, (bot, message) => {
      let command = this.parseCommand(message.text);
      if (command) {
        command.run(message);
      }
    });
  }

  say(incomingMessage, replyMessage) {
    return new Promise((resolve, reject) => {
      this.slackBot.startConversation(incomingMessage, (err, conversation) => {
        if (err) {
          reject(err);
        } else {
          conversation.say(replyMessage);
          resolve(conversation);
        }
      });
    });
  }

  log() {
    this.slackBot.botkit.log(err.stack);
  }
}

module.exports = Client;
