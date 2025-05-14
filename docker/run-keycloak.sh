#!/bin/bash

docker stop fwca-keycloak 2> /dev/null
docker rm fwca-keycloak 2> /dev/null

source ../.keycloak.env

# ATENÇÃO: a tentativa de usar o servidor H2 para banco de dados falhou.
# Optamos por usar o database Postgres

docker-compose up

echo "Exec: docker logs -f fwca-keycloak &"
echo "Para parar o conatainer use:"
echo "docker stop fwca-keycloak && docker rm fwca-keycloak && docker ps -a"
echo "Para parar o Database H2 é necessário encontrar seu PID assim:"
echo "ps -ef | grep h2-2.3.232.jar | grep -v grep"
