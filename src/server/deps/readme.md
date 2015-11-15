# huge/deps

Container with all the huge-server dependencies, so it doesn't need to be recompiled during development.

Create (from the main server directory):

    docker build --rm=true -t huge/deps ./deps

Includes:

* Registrator `latest`
* Consul `0.5.2`
* Node `5.0.0`
