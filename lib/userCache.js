'use strict';

let q = require('q');
let cache = new Set();
let bot;

module.exports.init = function(b) {
  bot = b;
  return populateCache();
};

module.exports.add = function(val) {
  cache.add(val);
};

module.exports.entriesAsRegex = function() {
  let usernames = [];

  for (let username of cache.values()) {
    usernames.push(username);
  }

  return new RegExp('(' + usernames.join('|') + ')', 'gi');
};

function populateCache() {
  let listUsers = q.nbind(bot.api.users.list, bot.api.users);

  return listUsers({})
    .then(list => {
      let users = [];

      if (list.ok) {
        users = list.members.map(user => user.name);
      }
      cache = new Set(users);
    })
    .catch(err => {
      console.log('error populating cache', err);
    });
};
