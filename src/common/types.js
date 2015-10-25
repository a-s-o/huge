'use stirct';

const t = require('@aso/tcomb');
const Bunyan = require('bunyan');
const Forever = require('forever-monitor');

const EnvVarRegex = /^[A-Z_]+$/;
const EnvironmentVariable = t.subtype(t.String, function EnvironmentVariable (str) {
   return EnvVarRegex.test(str);
});

const SerializableValue = t.union([t.String, t.Number], 'SerializableValue');

const EnvironmentObject = t.dict(
   EnvironmentVariable,
   SerializableValue,
   'EnvironmentObject'
);

const Logger = t.irreducible('BunyanLogger', function isBunyanLogger (logger) {
   return logger instanceof Bunyan;
});

const Monitor = t.irreducible('ForeverMonitor', function isMonitor (monitor) {
   return monitor instanceof Forever.Monitor;
});

module.exports = {
   EnvironmentVariable,
   EnvironmentObject,
   Logger,
   Monitor
};
