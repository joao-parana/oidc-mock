#!/bin/bash

source ../.keycloak.env
docker build -t keycloak-mock:26.2 \
  --build-arg KEYCLOAK_REALM=$KEYCLOAK_REALM \
  --build-arg KEYCLOAK_SERVER=$KEYCLOAK_SERVER \
  --build-arg KEYCLOAK_PORT=$KEYCLOAK_PORT \
  --build-arg KEYCLOAK_ADMIN=$KEYCLOAK_ADMIN \
  --build-arg KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD .
