'use strict';

let listeners = require('./lib/listeners');
let userCache = require('./lib/userCache');
let plugin = module.exports;

plugin.init = function(controller, bot) {
  userCache.init(bot);

  controller.on('channel_joined', listeners.joined);
  controller.on('group_joined', listeners.joined);
  controller.hears('what do you (think|say) (about|of) (.*)', 'direct_message,direct_mention,mention', listeners.markovRespond);
};

plugin.help = {
  command: 'markov',
  text: function(botname) {
    return 'Ask your bot to weigh in on your most burning questions with ' +
      '`@' + botname + ' what do you (think|say) (about|of) ...`';
  }
};
