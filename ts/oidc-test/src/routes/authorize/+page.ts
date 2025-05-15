import { keycloak } from '$lib/auth/keycloak';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const load = async () => {
    if (!browser) return;

    try {
        console.log('Iniciando processo de login...');
        console.log('Estado atual do Keycloak:', {
            authenticated: keycloak.authenticated,
            token: keycloak.token ? 'Presente' : 'Ausente',
            refreshToken: keycloak.refreshToken ? 'Presente' : 'Ausente',
            tokenParsed: keycloak.tokenParsed
        });

        // Log detalhado da URL de redirecionamento
        const redirectUri = 'http://localhost:8094/authorize/';
        console.log('URL de redirecionamento configurada:', {
            redirectUri,
            currentUrl: window.location.href,
            searchParams: window.location.search,
            hash: window.location.hash
        });

        // Inicia o processo de login
        await keycloak.login({
            redirectUri: redirectUri
        });

        console.log('Após login, estado do Keycloak:', {
            authenticated: keycloak.authenticated,
            token: keycloak.token ? 'Presente' : 'Ausente',
            refreshToken: keycloak.refreshToken ? 'Presente' : 'Ausente',
            tokenParsed: keycloak.tokenParsed
        });

        // Verifica se o usuário está autenticado
        if (keycloak.authenticated) {
            console.log('Usuário autenticado, redirecionando para /protected');
            goto('/protected');
        } else {
            console.log('Usuário não autenticado, redirecionando para /');
            goto('/');
        }
    } catch (error: any) {
        console.error('Erro detalhado no callback de autorização:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
            currentUrl: window.location.href,
            searchParams: window.location.search,
            hash: window.location.hash
        });
        goto('/');
    }
};
