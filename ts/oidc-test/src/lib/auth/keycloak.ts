// src/lib/auth/keycloak.ts
import Keycloak from 'keycloak-js';

const REDIRECT_URI = 'http://localhost:8094/authorize/';

const keycloakConfig = {
	url: 'http://localhost:8180',
	realm: 'mock',
	clientId: 'fwca-client'
};

console.log('Configuração inicial do Keycloak:', {
	...keycloakConfig,
	redirectUri: REDIRECT_URI
});

export const keycloak = new Keycloak(keycloakConfig);

// Adicione isso para tornar a instância acessível globalmente (opcional)
declare global {
	interface Window {
		keycloak: Keycloak;
	}
}

if (typeof window !== 'undefined') {
	window.keycloak = keycloak;
}

export async function initializeKeycloak() {
	try {
		console.log('Inicializando Keycloak com configurações:', {
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: `${REDIRECT_URI}silent-check-sso.html`,
			pkceMethod: 'S256',
			redirectUri: REDIRECT_URI
		});

		const authenticated = await keycloak.init({
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: `${REDIRECT_URI}silent-check-sso.html`,
			pkceMethod: 'S256',
			redirectUri: REDIRECT_URI
		});

		console.log('Keycloak inicializado:', { 
			authenticated,
			token: keycloak.token ? 'Presente' : 'Ausente',
			refreshToken: keycloak.refreshToken ? 'Presente' : 'Ausente'
		});
		return authenticated;
	} catch (error: any) {
		console.error('Keycloak initialization failed:', {
			message: error?.message,
			stack: error?.stack,
			name: error?.name,
			currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
		});
		return false;
	}
}

export function login() {
	console.log('Iniciando login com configurações:', {
		redirectUri: REDIRECT_URI,
		currentUrl: window.location.href,
		searchParams: window.location.search,
		hash: window.location.hash
	});
	
	keycloak.login({
		redirectUri: REDIRECT_URI
	});
}

export function logout() {
	console.log('Iniciando logout com configurações:', {
		redirectUri: REDIRECT_URI,
		currentUrl: window.location.href
	});
	
	keycloak.logout({
		redirectUri: REDIRECT_URI
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
			name: keycloak.tokenParsed.name
		};
	}
	return null;
}
