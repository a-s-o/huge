# Huge
Micro-services framework for node.js

## Installation

**Caution:** Do not use until version `1.0.0`; all current releases are meant only for development and testing. Version 1 release will solidify the api and internals; expected November 2015

    > npm install huge

## What is this

**Huge** is set of components that allows you to design and build a system using small, independent `node.js` applications (called micro-services). These processes can communicate with each other using built in service discovery.

The framework plays to node's strengths to create small precise applications instead of building complex monolithic systems.

**Huge** is not designed for infinite scalability. I use it for benefits in code quality, isolation and organization. It is not meant for (twitter|google|facebook) scales. The name is _#ironic_.

## Features

* Easy orchestration of dependent applications
* Lightweight, provides a simple layer over proven components
* Service discovery using `consul`
* Load balancing between multiple instances of same micro-service using native node.js `cluster` module

# Roadmap to 1.0

* [ ] API documentation
* [ ] Process monitoring with `forever-monitor`
* [ ] Log consolidation using `bunyan`
* [ ] Connect remote nodes (currently single server only)
* [ ] Integration tests

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
