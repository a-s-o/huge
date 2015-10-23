# Huge
Micro-services framework for node.js

## Installation

    > npm install huge

## What is this

This framework allows you build a system using small, independent node.js applications running in separate processes (called micro-services). These processes can communicate with each other using built in service discovery.

Huge framework is not designed for infinite scalability. I use it for benefits in code quality, isolation and organization. It is not meant for (twitter|google|facebook) scales. The name is #ironic.

## Features

* Specify dependencies between independent node applications
* Lightweight, provides a simple layer over proven components
* Service discovery using `consul`
* Load balancing between multiple instances of same micro-service using native node.js `cluster` module

# Roadmap to 1.0

* [ ] Connect more than 1 nodes (currently only single server)
* [ ] Process monitoring with `forever-monitor`
* [ ] Log consolidation using `bunyan`


## Example

```javascript

const web = huge.node.create({
   name: 'web',
   services: [
      { packagePath: '/path/to/my-db-server' },
      { packagePath: '/path/to/my-authentication-api' },
      { packagePath: '/path/to/my-web-server' }
   ],
   // todo: remote dependencies (see @roadmap:1.0)
   //
   // remote: {
   //    hosts: [
   //       'other.server.com:8500'
   //    ],
   //    inputs: [
   //       'ACTIVITY_FEED_HOST',
   //       'ACTIVITY_FEED_PORT'
   //    ]
   // }
});

huge.start(myNode, {
   port: 8500,
   logger: huge.console
});

```
