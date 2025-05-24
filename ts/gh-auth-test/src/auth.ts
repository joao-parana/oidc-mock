import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private';

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
			//
			session.access_token = token.accessToken;
			console.log('session = ' + session); // Write to VITE console
			console.log('token = ' + token); // Write to VITE console
			console.log('user = ' + user); // Write to VITE console
			return session;
		}
		// JWT change -> session
	}
});
