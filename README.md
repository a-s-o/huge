# Huge
Micro-services orchestration and monitoring for node.js

## Installation

**Caution:** Do not use until version `1.0.0`; all current releases are meant only for development and testing. Version 1 release will solidify the api and internals; expected November 2015

    > npm install huge

## What is this

**Huge** is a framework that allows you to design and build a system using small, independent `node.js` applications (called micro-services). These processes can communicate with each other using built in service discovery.

The framework plays to node's strengths to create small precise applications instead of building complex monolithic systems.

**Huge** is not designed for infinite scalability or (twitter|google|facebook) size loads. I use it for benefits in code quality, isolation and organization. The name is _#ironic_.

## Features

* Easy orchestration of dependent applications
* Lightweight, provides a simple layer over proven components
    * Service discovery using internally monitored `consul` process
    * Process monitoring with `forever-monitor`
    * Load balanced instances using built-in `cluster` module
    * Log consolidation using `bunyan`
* Focus on low memory usage in production

## Roadmap to 1.0

* [x] Process monitoring with `forever-monitor`
* [x] Log consolidation using `bunyan`
* [ ] Allow `consul` to be run externally and passed in as a client
* [ ] API documentation
* [ ] Connect remote nodes (currently single server only)
* [ ] Integration tests
* [ ] Examples + open-source some services

### Future releases
* [ ] Windows and OSX support

## Example

```javascript

const myNode = huge.node.create({
   name: 'web',
   services: [
      huge.source.local('/path/to/my-db-server'),
      huge.source.local('/path/to/my-authentication-api'),
      huge.source.local('/path/to/my-web-server')
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
