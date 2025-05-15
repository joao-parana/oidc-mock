# Type Script test application

```bash
cd oidc-test
git pull

npm install
npm run dev -- --open
```

## Fluxo de autenticação

1. Ao abrir a página e clicar em `login` ocorre um redirecionamento para
   [http://localhost:8180/realms/mock/protocol/openid-connect/auth?client_id=fwca-client&redirect_uri=http%3A%2F%2Flocalhost%3A8094%2Fauthorize%2F&state=6384164e-0efa-4ea9-afce-4728535c0bf2&response_mode=fragment&response_type=code&scope=openid&nonce=175331e0-428b-43cc-a780-c6b7f7d6c20f&code_challenge=Wl4y5bvVyuiYAjtKqJ1KQI9-U-syjnKsKNsBAhL1EJ4&code_challenge_method=S256](http://localhost:8180/realms/mock/protocol/openid-connect/auth?client_id=fwca-client&redirect_uri=http%3A%2F%2Flocalhost%3A8094%2Fauthorize%2F&state=6384164e-0efa-4ea9-afce-4728535c0bf2&response_mode=fragment&response_type=code&scope=openid&nonce=175331e0-428b-43cc-a780-c6b7f7d6c20f&code_challenge=Wl4y5bvVyuiYAjtKqJ1KQI9-U-syjnKsKNsBAhL1EJ4&code_challenge_method=S256)

Fica a cargo do Keycloak a gestão de usuários e senhas.

2. Quando o usuário autentica ele é redirecionado de volta para a aplicação Svelte que mostra a área protegida.

# Criando a Aplicação (SPA) de teste usando o SvelteKit 2.21.0 com Keycloak

Vou criar uma aplicação SvelteKit com autenticação Keycloak usando a versão 5 do Svelte. Aqui está a instrução para criar a implementação completa.

**Isto já foi feito no projeto mas as instruções seguem abaixo como documentação.**

Comece criando uma App limpinha usando `npx sv create oidc-test `.

```bash
mkdir src/lib/auth
mkdir src/routes/protected
touch src/lib/auth/keycloak.ts
touch src/routes/+layout.svelte
touch src/routes/protected/+page.svelte
```

## 1. Estrutura do Projeto

```
src/
  lib/
    auth/
      keycloak.ts     # Configuração do Keycloak
  routes/
    +layout.svelte    # Layout principal
    +page.svelte      # Página inicial
    login/
      +page.svelte    # Página de login
    protected/
      +page.svelte    # Página protegida
  app.html            # Template HTML
```

## 2. Configuração do Keycloak

```typescript
// src/lib/auth/keycloak.ts
import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8180",
  realm: "mock",
  clientId: "fwca-client",
};

export const keycloak = new Keycloak(keycloakConfig);

export async function initializeKeycloak() {
  try {
    const authenticated = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    });

    return authenticated;
  } catch (error) {
    console.error("Keycloak initialization failed:", error);
    return false;
  }
}

export function login() {
  keycloak.login({
    redirectUri: "http://localhost:8094/authorize/",
  });
}

export function logout() {
  keycloak.logout({
    redirectUri: "http://localhost:8094",
  });
}

export function getToken() {
  return keycloak.token;
}

export function getUserInfo() {
  if (keycloak.tokenParsed) {
    return {
      username: keycloak.tokenParsed.preferred_username,
      email: keycloak.tokenParsed.email,
      name: keycloak.tokenParsed.name,
    };
  }
  return null;
}
```

## 3. Layout Principal

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { keycloak } from '$lib/auth/keycloak';
  import { initializeKeycloak } from '$lib/auth/keycloak';
  import { onMount } from 'svelte';

  let authenticated = false;
  let userInfo: { username: string } | null = null;

  onMount(async () => {
    authenticated = await initializeKeycloak();
    if (authenticated) {
      userInfo = getUserInfo();
    }
  });
</script>

<nav>
  {#if authenticated}
    <span>Welcome, {userInfo?.username}</span>
    <button on:click={logout}>Logout</button>
  {:else}
    <button on:click={login}>Login</button>
  {/if}
</nav>

<slot />
```

## 4. Página Inicial

```svelte
<!-- src/routes/+page.svelte -->
<h1>Hello World</h1>

{#if $keycloak.authenticated}
  <p>You are logged in!</p>
  <a href="/protected">Go to protected page</a>
{:else}
  <p>Please log in to access protected content</p>
{/if}
```

## 5. Página Protegida

```svelte
<!-- src/routes/protected/+page.svelte -->
<script lang="ts">
  import { keycloak } from '$lib/auth/keycloak';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$keycloak.authenticated) {
      login();
    }
  });
</script>

<h1>Protected Content</h1>
<p>This content is only visible to authenticated users</p>
```

## 6. Configuração do SvelteKit

```javascript
// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 8094,
  },
});
```

## 7. package.json

```json
{
  "name": "sveltekit-keycloak",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.21.0",
    "svelte": "^5.28.2",
    "svelte-check": "^3.6.0",
    "typescript": "^5.4.2",
    "vite": "^5.2.0"
  },
  "dependencies": {
    "keycloak-js": "^26.2.0"
  }
}
```

## 8. Como Executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

```
http://localhost:8094
```

## Funcionalidades Implementadas:

1. **Autenticação com Keycloak**:

   - Login via Keycloak
   - Logout
   - Verificação de sessão

2. **Proteção de Rotas**:

   - Página protegida que redireciona para login se não autenticado

3. **Exibição de Informações do Usuário**:

   - Mostra o nome do usuário após login
   - Botão de logout

4. **Configuração Hard-coded**:

   - Todas as configurações do Keycloak estão no código conforme seus parâmetros

5. **SPA Completa**:
   - Navegação sem recarregamento de página
   - Estado de autenticação mantido no cliente

Certifique-se de que seu servidor Keycloak está rodando em `http://localhost:8180` com as configurações especificadas antes de testar a aplicação.

## Tratamento de erros.

### primeira interação

**Corrigindo o Erro:**
src/routes/+page.svelte:9:5 `$keycloak` is an illegal variable name. To reference a global variable called `$keycloak`, use `globalThis.$keycloak`
https://svelte.dev/e/global_reference_invalid

```diff
diff --git a/ts/oidc-test/src/lib/auth/keycloak.ts b/ts/oidc-test/src/lib/auth/keycloak.ts
index 88311be..bcf8076 100644
--- a/ts/oidc-test/src/lib/auth/keycloak.ts
+++ b/ts/oidc-test/src/lib/auth/keycloak.ts
@@ -9,6 +9,17 @@ const keycloakConfig = {

 export const keycloak = new Keycloak(keycloakConfig);

+// Adicione isso para tornar a instância acessível globalmente (opcional)
+
+declare global {
+	interface Window {
+		keycloak: Keycloak;
+	}
+}
+
+if (typeof window !== 'undefined') {
+	window.keycloak = keycloak;
+}
 export async function initializeKeycloak() {
 	try {
 		const authenticated = await keycloak.init({
diff --git a/ts/oidc-test/src/routes/+layout.svelte b/ts/oidc-test/src/routes/+layout.svelte
index 86f6afe..f8d4d1c 100644
--- a/ts/oidc-test/src/routes/+layout.svelte
+++ b/ts/oidc-test/src/routes/+layout.svelte
@@ -1,23 +1,40 @@
 <!-- src/routes/+layout.svelte -->
 <script lang="ts">
 	import { keycloak } from '$lib/auth/keycloak';
-	import { initializeKeycloak } from '$lib/auth/keycloak';
 	import { onMount } from 'svelte';

 	let authenticated = false;
-	let userInfo: { username: string } | null = null;
+	let userInfo: { username?: string } = {};

 	onMount(async () => {
-		authenticated = await initializeKeycloak();
+		authenticated = await keycloak.init({
+			onLoad: 'check-sso',
+			pkceMethod: 'S256'
+		});
+
 		if (authenticated) {
-			userInfo = getUserInfo();
+			userInfo = {
+				username: keycloak.tokenParsed?.preferred_username
+			};
 		}
 	});
+
+	function login() {
+		keycloak.login({
+			redirectUri: 'http://localhost:8094/authorize/'
+		});
+	}
+
+	function logout() {
+		keycloak.logout({
+			redirectUri: 'http://localhost:8094'
+		});
+	}
 </script>

 <nav>
 	{#if authenticated}
-		<span>Welcome, {userInfo?.username}</span>
+		<span>Welcome, {userInfo.username}</span>
 		<button on:click={logout}>Logout</button>
 	{:else}
 		<button on:click={login}>Login</button>
diff --git a/ts/oidc-test/src/routes/+page.svelte b/ts/oidc-test/src/routes/+page.svelte
index f73e82f..b296d35 100644
--- a/ts/oidc-test/src/routes/+page.svelte
+++ b/ts/oidc-test/src/routes/+page.svelte
@@ -4,9 +4,13 @@
 -->

 <!-- src/routes/+page.svelte -->
+<script lang="ts">
+	import { keycloak } from '$lib/auth/keycloak';
+</script>
+
 <h1>Hello World</h1>

-{#if $keycloak.authenticated}
+{#if keycloak.authenticated}
 	<p>You are logged in!</p>
 	<a href="/protected">Go to protected page</a>
 {:else}
diff --git a/ts/oidc-test/src/routes/protected/+page.svelte b/ts/oidc-test/src/routes/protected/+page.svelte
index de45300..daf9664 100644
--- a/ts/oidc-test/src/routes/protected/+page.svelte
+++ b/ts/oidc-test/src/routes/protected/+page.svelte
@@ -4,8 +4,8 @@
 	import { onMount } from 'svelte';

 	onMount(() => {
-		if (!$keycloak.authenticated) {
-			login();
+		if (!keycloak.authenticated) {
+			keycloak.login();
 		}
 	});
 </script>
```

### segunda interação

http://localhost:8180/realms/mock/protocol/openid-connect/auth?client_id=fwca-client&redirect_uri=http%3A%2F%2Flocalhost%3A8094%2F&state=d230784b-18fc-482b-95b1-e3a4b878f537&response_mode=fragment&response_type=code&scope=openid&nonce=d520bb6a-01fc-494e-8766-ade59e124c5d&prompt=none&code_challenge=eE9pD9xCCjWDppvnQUjITnvtOqiga5Rc0F316ipjDW4&code_challenge_method=S256

```diff

```

### terceira interação

http://localhost:8180/realms/mock/protocol/openid-connect/auth?client_id=fwca-client&redirect_uri=http%3A%2F%2Flocalhost%3A8094%2Fauthorize%2F&state=e81301c3-a428-48e1-84d4-ce1897a9a2db&response_mode=fragment&response_type=code&scope=openid&nonce=3c5a35a6-5032-4637-a940-ddee440521c8&code_challenge=DLpUk6k2E6BzhxMW47Yq6VHNutXbB-86nxN_MrhWaac&code_challenge_method=S256

```diff

```
