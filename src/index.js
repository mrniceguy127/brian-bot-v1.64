'use-strict';

// Command prefix for bot (e.g. "COMMAND_PREFIX.help" to run help command)
const commandPrefix = process.env.COMMAND_PREFIX;

// Slack login information
const slackToken = process.env.CLIENT_TOKEN;
const slackOAuth = process.env.CLIENT_OAUTH;
const slackSigningSecret = process.env.CLIENT_SIGNING_SECRET;

// Initialize Botkit and Slack controller
const Botkit = require('botkit');
const slackController = Botkit.slackbot({
  require_delivery: true,
  clientSigningSecret: slackSigningSecret
});
const slackBot = slackController.spawn({
  token: slackToken
});

// Connect to Slack API
slackBot.startRTM((err, bot, payload) => {
  if (err) {
    throw new Error('Brian could not connect to Slack!');
  } else {
    slackController.log("Slack connection established!");
  }
});

// Initializes Client class to interface with Botkit
const Client = require('../lib/client/client');
const client = new Client(slackBot, slackController, commandPrefix);

let firstRun = true; // To-do: store in JSON
let introChannel = firstRun ? process.env.INTRO_CHANNEL : '';
client.initialize(introChannel, './src/commands');

module.exports = client;
