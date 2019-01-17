'use-strict';
const dotenv = require('dotenv');

dotenv.config();

const Botkit = require('botkit');

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

const Ponder = require('./lib/commands/ponder');

slackController.hears(["bls.ponder"], ["ambient", "direct_message"], (bot, message) => {
  let cmd = new Ponder(bot);
  cmd.run(message, [
    "Floating-point is evil.",
    "JS frameworks are unnecessary.",
    "Coding in binary is superior.",
    "I should wear festive Christmas headgear.",
    "Exams are fun."
  ]);
});
