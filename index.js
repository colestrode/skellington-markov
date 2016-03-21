'use strict';

let listeners = require('./lib/listeners');
let userCache = require('./lib/userCache');
let plugin = module.exports;

plugin.init = function(controller, bot) {
  userCache.init(bot);

  controller.on('channel_joined', listeners.joined);
  controller.on('group_joined', listeners.joined);
  controller.hears('what do you (think|say) about (.*)', 'direct_message,direct_mention,mention', listeners.markovRespond);
};
