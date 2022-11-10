#!/bin/bash

if ! [ -z "which docker" ]; then
    echo ""
    docker stop quantum > /dev/null
    docker ps -a
    echo ""
fi


if ! [ -z "which pm2" ]; then
    echo ""
    pm2 stop quantum --watch
    echo ""
fi