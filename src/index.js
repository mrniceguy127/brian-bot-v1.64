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

// Initialize save data
let firstRun = true;
const jsonfile = require('jsonfile');
const firstRunFile = './save-data/first-run.json';
jsonfile.readFile(firstRunFile, function(err, data) {
  if (err) {
    console.error(err);
  } else {
    if (data.firstRun === false) {
      firstRun = false;
    }
  }
  // If first run now, save JSON file for next time indicating firstRun = false
  if (firstRun) {
    let toSave = { firstRun: false };
    jsonfile.writeFile(firstRunFile, toSave, function(err) {
      if (err) {
        console.error(err);
      }
    });
  }

  slackController.log("firstRun = " + firstRun);

  // Continue to initialize client
  let introChannel = firstRun ? process.env.INTRO_CHANNEL : '';
  client.initialize(introChannel, './src/commands');
});

module.exports = client;
