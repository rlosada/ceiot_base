#!/bin/bash

# detener
docker stop $(docker ps -aq)

# eliminar
docker rm $(docker ps -aq)

# crear nuevos
docker-compose -p repo up
