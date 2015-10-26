'use stirct';

const t = require('@aso/tcomb');
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

const Monitor = t.irreducible('ForeverMonitor', function isMonitor (monitor) {
   return monitor instanceof Forever.Monitor;
});

const StringOrNumber = t.union([t.String, t.Number], 'StringOrNumber');

module.exports = {
   EnvironmentVariable,
   EnvironmentObject,
   Monitor,
   StringOrNumber
};
