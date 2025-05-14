// src/lib/auth/keycloak.ts
import Keycloak from 'keycloak-js';

const keycloakConfig = {
	url: 'http://localhost:8180',
	realm: 'mock',
	clientId: 'fwca-client'
};

export const keycloak = new Keycloak(keycloakConfig);

export async function initializeKeycloak() {
	try {
		const authenticated = await keycloak.init({
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
			pkceMethod: 'S256'
		});

		return authenticated;
	} catch (error) {
		console.error('Keycloak initialization failed:', error);
		return false;
	}
}

export function login() {
	keycloak.login({
		redirectUri: 'http://localhost:8094/authorize/'
	});
}

export function logout() {
	keycloak.logout({
		redirectUri: 'http://localhost:8094'
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
