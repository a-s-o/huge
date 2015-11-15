# huge/server

## Build

From the main server directory

    docker build --rm=true -t huge/server .

## Run

```shell
docker run -d \
    --name=huge \
    --net=host \
    --volume=/var/run/docker.sock:/tmp/docker.sock \
    huge/server:latest \
      consul://localhost:8500
```

### Docker Options

Option                                           | Required    | Description
------                                           | --------    | -----------
`--volume=/var/run/docker.sock:/tmp/docker.sock` | yes         | Allows Registrator to access Docker API
`--net=host`                                     | recommended | Helps Registrator get host-level IP and hostname

An alternative to host network mode would be to set the container hostname to the host
hostname (`-h $HOSTNAME`) and using the `-ip` Registrator option below.

### Registrator Options

Option                   | Description
------                   | -----------
`-internal`              | Use exposed ports instead of published ports
`-tags <tags>`           | Force comma-separated tags on all registered services
`-ttl <seconds>`         | TTL for services. Default: 0, no expiry (supported backends only)
`-ttl-refresh <seconds>` | Frequency service TTLs are refreshed (supported backends only)
`-resync <seconds>`      | Frequency all services are resynchronized. Default: 0, never

If the `-internal` option is used, Registrator will register the docker0
internal IP and port instead of the host mapped ones.

By default, when registering a service, Registrator will assign the service
address by attempting to resolve the current hostname. If you would like to
force the service address to be a specific address, you can specify the `-ip`
argument.

For registry backends that support TTL expiry, Registrator can both set and
refresh service TTLs with `-ttl` and `-ttl-refresh`.

If you want unlimited retry-attempts use `-retry-attempts -1`.

The `-resync` options controls how often Registrator will query Docker for all
containers and reregister all services.  This allows Registrator and the service
registry to get back in sync if they fall out of sync.
