FROM huge/deps:latest

EXPOSE 8300 8301 8301/udp 8302 8302/udp 8400 8500 8600 8600/udp

ADD ./config /config/

# ENTRYPOINT ["/bin/consul", "agent", "-config-dir=/config"]
# ENTRYPOINT ["/bin/consul", "agent", "-server", "-config-dir=/config"]
