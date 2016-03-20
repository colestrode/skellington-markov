'use strict';

let listeners = require('./lib/listeners');
let plugin = module.exports;

plugin.init = function(controller) {
  listeners.init(controller);
  controller.on('ambient', listeners.ambient);
  controller.hears('what do you (think|say)', 'direct_message,direct_mention,mention', listeners.markovRespond);
};
