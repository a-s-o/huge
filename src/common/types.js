'use stirct';

const t = require('@aso/tcomb');
const Bunyan = require('bunyan');

const EnvVarRegex = /^[A-Z_]+$/;

const EnvironmentVariable = t.subtype(t.String, function EnvironmentVariable (str) {
   return EnvVarRegex.test(str);
});

const Logger = t.irreducible('BunyanLogger', function BunyanLogger (logger) {
   return logger instanceof Bunyan;
});

module.exports = {
   EnvironmentVariable,
   Logger
};
