'use-strict';

class Client {
  constructor(slackBot, slackController, commandPrefix) {
    this.slackBot = slackBot; // The Slack bot for Botkit.
    this.slackController = slackController; // The Slack controller for Botkit.
    this.commandPrefix = commandPrefix; // Command prefix for commands.
    this.commands = new Map(); // Map of commands (Key (command name) => Value (command instance)).
  }

  // Loads commands and stores them in client.
  loadCommands(commandsPath) {
    const getCommandClasses = require('../utils/get-command-classes'); // Returns and array of all of the command classes
    let commandClasses = getCommandClasses(commandsPath); // Get the command classes.
    commandClasses.forEach((commandClass) => { // Iterate over the array and store them in a Map of commands that have been instantiated.
      let command = new commandClass(this);
      this.commands.set(command.name, command); // Key (command name) => Value (command instance)
    });
  }

  parseCommand(messageText) { // Parse the command based on the message text
    let foundCommand = undefined;

    Array.from(this.commands.values()).forEach((command) => {
      let commandCallPrefix = `${this.commandPrefix}${command.name}`;
      let commandRegExp = new RegExp(`^(${commandCallPrefix})\\s+`); // Find a command usage. Ex: 'prefix.commandname test' is valid because thee command call has at least one white space character after it.
      if (messageText.search(commandRegExp) !== -1 || commandCallPrefix === messageText.trim()) { // Check if RegEx matched something in the message text or the message equals the command call because no arguments were given (Ex: if prefix.command1 === prefix.command1).
        foundCommand = command;
      }
    });

    return foundCommand; // Return the command that matches.
  }

  listenForCommands(messageTypes = [ 'direct_message', "ambient" ]) { // Listen for commands based on the message type with default value.
    this.slackController.hears(".*", messageTypes, (bot, message) => { // Listen to all messages
      let command = this.parseCommand(message.text); // Parse a command if there is one
      if (command) { // Command?
        command.run(message); // Then run it.
      }
    });
  }

  say(incomingMessage, replyMessage) { // Reply to a message based on the incoming message and the reply message. replyMessage can be string or a message object.
    return new Promise((resolve, reject) => { // Resolve is message was successfully sent, reject otherwise.
      this.slackBot.startConversation(incomingMessage, (err, conversation) => {
        if (err) {
          reject(err);
        } else {
          conversation.say(replyMessage);
          resolve(conversation); // Resolve with conversation.
        }
      });
    });
  }

  log() { // Log something.
    this.slackBot.botkit.log(err.stack);
  }
}

module.exports = Client;
