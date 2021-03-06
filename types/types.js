'use strict';

const t = require('@aso/tcomb');
const url = require('url');
const bunyan = require('bunyan');

const optional = t.maybe.bind(t);
const list = t.list.bind(t);

const ServiceOptions = t.struct({
   instances      : optional(t.Number),   // number of worker instances to run

   setupTimeout   : optional(t.Number),   // in milliseconds
   minUptime      : optional(t.Number),   // in milliseconds
   spinSleepTime  : optional(t.Number)    // in milliseconds
}, 'ServiceOptionsSpec');

const ServiceSpec = t.struct({
   packagePath: t.String,
   huge: optional( ServiceOptions )
}, 'HugeServiceSpec');

const Host = t.subtype(t.String, matchHost, 'Host <ip:port>');

const NodeSpec = t.struct({
   name: t.String,
   services: list( ServiceSpec ),
   packageSource: optional(t.String),
   remote: optional(t.struct({
      join: list( Host ),
      dependencies: list( t.String )
   }))
}, 'HugeNodeSpec');

const Metadata = t.struct({
   name: t.String,
   packagePath: t.String,
   consumes: t.list(t.String),
   provides: t.list(t.String),
   checked: t.Boolean,
   config: t.Object
});

const Logger = t.irreducible('BunyanLogger', inst => (inst instanceof bunyan));

const StartOptions = t.struct({
   port: optional(t.Number),
   logger: optional(Logger)
}, 'StartOptions');

module.exports = {
   ServiceOptions,
   ServiceSpec,
   Host,
   NodeSpec,
   Logger,
   StartOptions,
   Metadata
};

function matchHost (str) {
   const parsed = url.parse(str);
   return str === `${parsed.hostname}:${parsed.port}`;
}
