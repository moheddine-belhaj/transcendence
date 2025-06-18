#!/bin/bash
# Install plugin only if not already installed
if ! logstash-plugin list | grep -q "logstash-output-prometheus"; then
    logstash-plugin install logstash-output-prometheus
fi
# Run default entrypoint
exec /usr/local/bin/docker-entrypoint "$@"