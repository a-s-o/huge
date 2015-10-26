'use strict';

const _ = require('lodash');
const t = require('@aso/tcomb');
const Bunyan = require('bunyan');

function isBunyanLogger (logger) {
   return logger instanceof Bunyan;
}

const Logger = module.exports = t.irreducible('BunyanLogger', isBunyanLogger);

// Logger.create returns the default logger used
// by huge when a logger is not supplied by the
// user. This is not a replacement for Bunyan.createLogger
Logger.create = t.typedFunc({
   inputs: [t.String],
   output: Logger,
   fn: function loggerFactory (name) {
      return Bunyan.createLogger({
         name: name,
         huge: 'v1',
         streams: [
            { level: 'info', stream: process.stdout },
            { level: 'error', stream: process.stderr }
         ],
         serializers: {
            buffer: buf => buf.toString(),
            err: err => ({
               message: err.message,
               stack: err.stack.split('\n')
            })
         }
      });
   }
});
