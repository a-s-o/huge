FROM gliderlabs/registrator:latest

ENV CONSUL_VERSION 0.5.2
ENV CONSUL_SHA256 171cf4074bfca3b1e46112105738985783f19c47f4408377241b868affa9d445
ENV DNS_RESOLVES consul
ENV DNS_PORT 8600
ENV NODE_VERSION=v5.0.0
ENV NPM_VERSION=3

# Consul (agent)
RUN apk add --update curl ca-certificates && \
    curl -Ls https://circle-artifacts.com/gh/andyshinn/alpine-pkg-glibc/6/artifacts/0/home/ubuntu/alpine-pkg-glibc/packages/x86_64/glibc-2.21-r2.apk > /tmp/glibc-2.21-r2.apk && \
    apk add --allow-untrusted /tmp/glibc-2.21-r2.apk && \
    rm -rf /tmp/glibc-2.21-r2.apk /var/cache/apk/*
ADD https://dl.bintray.com/mitchellh/consul/${CONSUL_VERSION}_linux_amd64.zip /tmp/consul.zip
RUN echo "${CONSUL_SHA256}  /tmp/consul.zip" > /tmp/consul.sha256 \
  && sha256sum -c /tmp/consul.sha256 \
  && cd /bin \
  && unzip /tmp/consul.zip \
  && chmod +x /bin/consul \
  && rm /tmp/consul.zip

# Consul (UI)
ADD https://dl.bintray.com/mitchellh/consul/0.5.2_web_ui.zip /tmp/webui.zip
RUN cd /tmp && unzip webui.zip && mv dist /ui && rm webui.zip

# Node
RUN apk add --update curl make gcc g++ python linux-headers paxctl libgcc libstdc++ && \
  curl -sSL https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}.tar.gz | tar -xz && \
  cd /node-${NODE_VERSION} && \
  ./configure --prefix=/usr && \
  make -j$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) && \
  make install && \
  paxctl -cm /usr/bin/node && \
  cd / && \
  if [ -x /usr/bin/npm ]; then \
    npm install -g npm@${NPM_VERSION} && \
    find /usr/lib/node_modules/npm -name test -o -name .bin -type d | xargs rm -rf; \
  fi && \
  apk del curl make gcc g++ python linux-headers paxctl && \
  rm -rf /etc/ssl /node-${VERSION} \
    /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp \
    /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html
