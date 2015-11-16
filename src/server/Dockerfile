FROM huge/deps:latest

EXPOSE 8300 \
   8301 8301/udp \
   8302 8302/udp \
   8400 \
   8500 \
   8600 8600/udp \
   3000

ADD ./config /config/

## Prodiction
# RUN mkdir /server
# COPY ['./package.json', './www', '/server'];
# ...npm install
# ENTRYPOINT ["/usr/bin/node", "/server/www/start.js"]
# CMD []

## Development
RUN mkdir /server
VOLUME /server
ENTRYPOINT ["/server/node_modules/.bin/node-dev", "/server/www/start.js"]
CMD []

# ENTRYPOINT ["/bin/consul", "agent", "-config-dir=/config"]
# ENTRYPOINT ["/bin/consul", "agent", "-server", "-config-dir=/config"]
