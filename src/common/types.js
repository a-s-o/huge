'use stirct';

const t = require('@aso/tcomb');

const EnvVarRegex = /^[A-Z_]+$/;

const EnvironmentVariable = t.subtype(t.String, function EnvironmentVariable (str) {
   return EnvVarRegex.test(str);
});

module.exports = {
   EnvironmentVariable
};
