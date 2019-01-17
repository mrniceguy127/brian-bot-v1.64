'use-strict';
const dotenv = require('dotenv');

dotenv.config();

const Botkit = require('botkit');
const Client = require('./lib/client/client');

const slackToken = process.env.CLIENT_TOKEN;
const slackOAuth = process.env.CLIENT_OAUTH;
const slackSigningSecret = process.env.CLIENT_SIGNING_SECRET;

const slackController = Botkit.slackbot({
  require_delivery: true,
  clientSigningSecret: slackSigningSecret
});

const slackBot = slackController.spawn({
  token: slackToken
});

slackBot.startRTM((err, bot, payload) => {
  if (err) {
    throw new Error('Brian could not connect to slack!');
  } else {
    slackController.log("Slack connection established!");
  }
});

const client = new Client(slackBot, "bls.");

const Ponder = require('./src/commands/ponder');
const Hat = require('./src/commands/hat');

let ponderCmd = new Ponder(client);
let hatCmd = new Hat(client);

slackController.hears([`${client.commandPrefix}${ponderCmd.name}`, `${client.commandPrefix}${hatCmd.name}`], ["ambient", "direct_message"], (bot, message) => {
  if (message.text.startsWith(`${client.commandPrefix}${ponderCmd.name}`)) {
    ponderCmd.run(message);
  } else if (message.text.startsWith(`${client.commandPrefix}${hatCmd.name} `)) {
    hatCmd.run(message);
  }
});
