'use strict';

let markov = require('markov')(1);
let fs = require('fs');
let path = require('path');
let q = require('q');
let _ = require('lodash');
let userCache = require('./userCache');
let filter = require('./filter');
let listeners = module.exports;

listeners.joined = function(bot, message) {
  if (message.user) {
    userCache.add(message.user);
  }
};

listeners.markovRespond = function(bot, message) {
  let mSeed = q.nbind(markov.seed, markov);

  getSeedText(bot, message)
    .then(mSeed)
    .then(function() {
      let start = message.match[2];
      let text = markov.respond(start, _.random(3, 30)).join(' ');

      bot.reply(message, text);
    })
    .catch(function(err) {
      console.log(err);
    });
};

function getSeedText(bot, message) {
  let history = q.nbind(bot.api.channels.history, bot.api.channels);

  return history({limit: 1000, channel: message.channel})
    .then(result => {
      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.messages.map(message => filter(message)).join('\n');
    })
    .catch(err => {
      console.log('error fetching history', err);

      return fs.readFileSync(path.resolve(__dirname, './seed.txt'), {encoding: 'UTF-8'});
    });
}
