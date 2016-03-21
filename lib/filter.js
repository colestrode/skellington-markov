'use strict';

let userCache = require('./userCache');

function removeUsernames(text) {
  return text.replace(userCache.entriesAsRegex(), '');
}

function removeUserIds(text) {
  return text.replace(/<@U[A-Z0-9]*>/g, '');
}

module.exports = function(message) {
  return removeUserIds(removeUsernames(message.text));
};
