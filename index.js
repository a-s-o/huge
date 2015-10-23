'use strict';

const _ = require('lodash');
const t = require('tcomb-validation');

const cfg = require('./config');

// const consul = startConsul();
//
// consul.on('exit', () => {
//    console.log(`Consul has existed after [1] restarts`);
// });
//
// function startConsul () {
//    const dir = cfg.consul.dir;
//    const pidFile = path.join(dir, 'consul.pid');
//    const args = [
//       path.join(dir, 'consul'),
//       'agent',
//       '-server',
//       '-config-dir', path.resolve(process.cwd(), './cfg/consul'),
//       '-data-dir', path.resolve(dir, './data'),
//       '-ui-dir', path.resolve(dir, './ui'),
//       '-pid-file', pidFile,
//       '-bootstrap-expect', 1
//    ];
//
//    return forever.start(args, {
//       cwd: dir,
//       max: 1,
//       pidFile: pidFile
//    });
// }

const Node = require('./lib/node');

module.exports = {
   node: Node,
   // start: t.func([Node, t.Number], t.Any).of(startNode)
};
//
// function startNode (node, port) {
//    return new Cluster( node.packages, { port } );
// }


// const services = [
//    { packagePath: '' },
//    { packagePath: '' }
// ];
//
// const remote = {
//    hosts: [
//       '0.0.0.0:5500',
//       '0.0.0.0:5500',
//       '0.0.0.0:5500',
//       '0.0.0.0:5500'
//    ],
//    dependencies: [
//
//    ]
// };
//
// const myNode = huge.node.create({
//    name: 'something',
//    services: services,
//    remote: remote
// });
//
// huge.start(myNode, {
//    port: 8500,
//    logger: huge.console
// });
