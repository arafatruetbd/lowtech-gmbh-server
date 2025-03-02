#!/bin/bash
echo "Stopping running container..."
docker stop lowtech-gmbh-server || true
docker rm lowtech-gmbh-server || true
