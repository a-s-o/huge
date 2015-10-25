```javascript
// manifest.js

const couch = huge.source.npm('huge-couch', {

});

const elasticsearch = huge.service.npm('huge-elasticsearch', {

});

exports.web = huge.server({
   services: [
      huge.source.local('feed'),
      elasticsearch,
      huge.source.git('web')
   ]
});

exports.backup = huge.server({
   services: {
      'elasticsearch': elasticsearch,
      'couch': couch
   }
});



```
