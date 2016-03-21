'use strict';

let listeners = require('./lib/listeners');
let userCache = require('./lib/userCache');
let plugin = module.exports;

plugin.init = function(controller, bot) {
  listeners.init(controller);
  userCache.init(bot);

  controller.on('ambient', listeners.ambient);
  controller.on('channel_joined', listeners.joined);
  controller.on('group_joined', listeners.joined);
  controller.hears('what do you (think|say) about (.*)', 'direct_message,direct_mention,mention', listeners.markovRespond);

  setInterval(userCache.populateCache.bind(userCache), 5*60*1000); // update user cache so that it won't get stale
};
