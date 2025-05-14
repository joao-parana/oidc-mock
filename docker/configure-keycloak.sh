#!/bin/bash

echo "✅ `date` - Setting JAVA_OPTS='-Xms500m -Xmx1g'"
export JAVA_OPTS="-Xms300m -Xmx1g"
echo "JAVA_OPTS = $JAVA_OPTS"

echo "✅ `date` - ============================================================="
echo "✅ `date` - Configuring Keycloak instance"
echo "✅ `date` - Display JVM properties and memory configuration"
java -XshowSettings:vm -version
java -XshowSettings:properties -version

pwd
echo "✅ `date` - ============================================================="
env | sort
echo "✅ `date` - ============================================================="

# Ajuste parâmetros adicionais se necessário
export KC_HOSTNAME_STRICT=false
echo "Configuring Keycloak with:"
echo "Realm: $KC_REALM"
echo "Server: $KC_HOSTNAME"
echo "Port: $KC_HTTP_PORT"
# Função para esperar o Keycloak ficar pronto
wait_for_keycloak() {
    until (timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/$KC_HTTP_PORT") 2>/dev/null; do
      echo "✅ `date` - Aguardando Keycloak iniciar na porta $KC_HTTP_PORT..."
      sleep 4
    done
    echo "✅ `date` - Keycloak está respondendo na porta $KC_HTTP_PORT"
}

echo "✔ `date` - Aguardando 10 segundos pelo database"
sleep 10

# Importar usuários se o arquivo existir
if [ -f "/opt/keycloak/data/import/users.json" ]; then
    # TODO: código ainda não testado. Usuários são criados atualmente em realm-export.json
    echo "✅ `date` -Importando usuários..."
    /opt/keycloak/bin/kc.sh import --file /opt/keycloak/data/import/users.json --users realm_file
fi

# Importar o realm se o arquivo existir
if [ -f "/opt/keycloak/data/import/realm-export.json" ]; then
    echo "✅ `date` - Iniciando o Keycloak na porta $KC_HTTP_PORT para importar o REALM mock"

    # Inicia o Keycloak em segundo plano
    /opt/keycloak/bin/kc.sh start-dev \
        --http-enabled=true \
        --http-port=$KC_HTTP_PORT \
        --hostname=$KC_HOSTNAME \
        --hostname-strict=$KC_HOSTNAME_STRICT &

    # Espera o Keycloak iniciar
    wait_for_keycloak

    # Importa o realm
    echo "✅ `date` - Importando realm a partir do arquivo realm-export.json ..."
    /opt/keycloak/bin/kc.sh import \
        --file /opt/keycloak/data/import/realm-export.json --optimized

    # pkill -f "keycloak" || true
    echo "✅ `date` - Realm Importando. Keycloak no ar "
fi

echo "✅ `date` - Review the Keycloak configuration"
/opt/keycloak/bin/kc.sh show-config
echo "✅ `date` - ============================================================="
echo "✅ `date` - Keycloak no ar com Realm mock e alguns usuários para teste"
sleep 9999999999999
