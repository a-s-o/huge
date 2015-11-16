#!/bin/bash

case $1 in

'make-deps')
   # remake the deps container then remake server
   docker build --rm=true -t huge/deps ./src/deps
   docker build --rm=true -t huge/server ./src/server
   ;;

'make-server')
   # make the server container only
   docker build --rm=true -t huge/server ./src/server
   ;;

'make-app')
   # make the app only
   webpack -p --config webpack.production.config.js
   ;;

'make-all')
   # make the app first and then the server container
   webpack -p --config webpack.production.config.js
   docker build --rm=true -t huge/server ./src/server
   ;;

'start-server')
   # start the server container
   NAME='huge-server'

   # Ignore errors by piping true
   docker kill $NAME || true
   docker rm -f $NAME || true

   # Run and attache the container
   docker run -it \
      --name=$NAME \
      --volume=/var/run/docker.sock:/tmp/docker.sock \
      --volume=/home/aman/Code/huge2/src/server:/server \
      --net=host \
      huge/server
   ;;
esac
