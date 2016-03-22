'use strict';

let userCache = require('./userCache');

function removeUsernames(text) {
  return text.replace(userCache.entriesAsRegex(), '');
}

function removeUserIds(text) {
  return text.replace(/<@U[A-Z0-9|]*>/g, '');
}

// removing usernames and ids leaves a bunch of standalone colons, let's remove those
function removeColons(text) {
  return text.replace(/:\s/g, '');
}

module.exports = function(message) {
  return removeColons(
    removeUserIds(
    removeUsernames(
      message.text
    )
  ));
};
