# Red Hat Enterprise Linux Versão 9.5
FROM quay.io/keycloak/keycloak:26.2

ARG KEYCLOAK_REALM
ARG KEYCLOAK_SERVER
ARG KEYCLOAK_PORT
# ARG KEYCLOAK_ADMIN
# ARG KEYCLOAK_ADMIN_PASSWORD

# Defina variáveis de ambiente (opcional, pode sobrescrever via docker run)
# ENV KEYCLOAK_ADMIN=admin is deprecated
# ENV KEYCLOAK_ADMIN_PASSWORD=admin is deprecated
# Defina as variáveis de ambiente no container
ENV KC_REALM=$KEYCLOAK_REALM
ENV KC_HOSTNAME=$KEYCLOAK_SERVER
ENV KC_HTTP_PORT=$KEYCLOAK_PORT
ENV KC_HTTP_ENABLED=true

# Copie seus arquivos de configuração
# COPY --chown=keycloak:keycloak users.json /opt/keycloak/data/import/
# ATENÇÃO: ao tentar usar o H2 no modo Embedded ocorre erro irrecuperável no container.
COPY --chown=keycloak:keycloak configure-keycloak.sh /opt/keycloak/

# Usando o H2 em modo TCP Server. Depende do servidor rodando no Host mas falhou no teste
# Usando o H2 no modo dev-file: NÃO FUNCIONOU !
# ENV KC_DB=dev-file
# ENV KC_DB_URL='jdbc:h2:tcp://host.docker.internal:9123/keycloakdb;DB_CLOSE_ON_EXIT=FALSE'
# ENV KC_BOOTSTRAP_ADMIN_USERNAME=sa
# ENV KC_BOOTSTRAP_ADMIN_PASSWORD=sa
# ENV KC_DB_USERNAME=sa
# ENV KC_DB_PASSWORD=sa

# Ajuste as permissões e execute o script de configuração
USER root
RUN chmod a+rx /opt/keycloak/configure-keycloak.sh
USER keycloak

# Define a porta padrão do Keycloak
EXPOSE 8180/tcp

# Script de entrada personalizado
ENTRYPOINT ["/opt/keycloak/configure-keycloak.sh"]
