# keycloak-mock

Configuration can be edited in `docker/data/import/realm-export.json` file

```
# Use Python 3.12
python -m venv .myenv
source .myenv/bin/activate
python3 -m pip install --upgrade pip
# Install linters and formaters support for VSCode
python3 -m pip install mypy pyright black ruff
# Install VSCode plugins too.
```

Build image and start container

```bash
cd docker
./build-image.sh
docker-compose up -d
docker-compose logs -f
# To enable DEBUG messages remove comment in 2 lines on docker/docker-compose.yml file
# KEYCLOAK_LOGLEVEL: DEBUG
# KC_LOG_LEVEL: DEBUG
```

Run Svelt App to do a integration test

```bash
cd ts/oidc-test
head -n 20 README.md
npm install
npm run build ; npm run preview
```

Other important settings for client App:

```json
      "clientAuthenticatorType": "client-secret",
      "clientId": "fwca-client",
      "name": "fwca",
      "secret": "HhOZOkJ3aXaOXVMesVKGpYvdoOsyBsOF",
      "redirectUris": ["http://localhost:8094/authorize/"],
```
