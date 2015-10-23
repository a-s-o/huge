# huge
Micro-services framework for node.js

## Example

```javascript

const web = huge.node.create({
   name: 'web',
   services: [
      { packagePath: '/path/to/my-db-server' },
      { packagePath: '/path/to/my-authentication-api' },
      { packagePath: '/path/to/my-web-server' }
   ],
   // todo: remote dependencies (@roadmap:1.0)
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
