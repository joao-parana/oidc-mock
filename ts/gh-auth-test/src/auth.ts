import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private';

function logObjectDetails(name: string, my_obj: unknown) {
	console.log(`--- Details for ${name} ---`);
	if (typeof my_obj === 'object' && my_obj !== null) {
		const obj = my_obj;
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				let value = (obj as Record<string, unknown>)[key];
				// Para lidar com valores que também são objetos e não serem [object Object]
				if (typeof value === 'object' && value !== null) {
					value = JSON.stringify(value, null, 2); // Tenta stringify objetos aninhados
				}
				console.log(`  ${String(key)}: ${value}`);
			}
		}
	}
	console.log(`--- End of ${name} details ---`);
}

// GitHub talks BACK to our application, it is handled by the "handle" here
export const { handle } = SvelteKitAuth({
	providers: [GitHub({ clientId: GH_CLIENT_ID, clientSecret: GH_CLIENT_SECRET })],
	callbacks: {
		// JWT get sent to server?
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token, user }) {
			// @ts-expect-error access_token not defined in session
			session.access_token = token.accessToken;
			logObjectDetails('session', session); // Write to VITE console
			logObjectDetails('token', token); // Write to VITE console
			logObjectDetails('user', user); // Write to VITE console
			console.log('session = ', session); // Write to VITE console
			console.log('token = ', token); // Write to VITE console
			console.log('user = ', user); // Write to VITE console
			return session;
		}
		// JWT change -> session
	}
});
