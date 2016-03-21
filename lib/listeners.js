'use strict';

let markov = require('markov')(1);
let fs = require('fs');
let path = require('path');
let q = require('q');
let _ = require('lodash');
let userCache = require('./userCache');
let filter = require('./filter');
let maxMessages = 250;
let storage;
let listeners = module.exports;

listeners.init = function(controller) {
  storage = require('botkit-promise-storage')(controller);
};

listeners.joined = function(bot, message) {
  if (message.user) {
    userCache.add(message.user);
  }
};

listeners.ambient = function(bot, message) {
  let text = filter(message);

  if (!text) {
    return q();
  }

  return storage.teams.get(message.team)
    .then(function(team) {
      if (!team) {
        team = {id: message.team};
      }

      if (!team.markov) {
        team.markov = [];
      }

      let filteredText = filter(text);

      if (filteredText.length > 10) {
        team.markov.unshift(filteredText);
        team.markov = team.markov.splice(0, maxMessages);
        return storage.teams.save(team);
      }
    });
};

listeners.markovRespond = function(bot, message) {
  let mSeed = q.nbind(markov.seed, markov);

  storage.teams.get(message.team)
    .then(function(team) {
      var seedList = (team && team.markov) ? team.markov : [];

      if (seedList.length < 100) {
        return fs.readFileSync(path.resolve(__dirname, './seed.txt'), {encoding: 'UTF-8'});
      }

      return seedList.join('\n');
    })
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
