### Modify from OIDC to SAML

```diff
git diff src/auth.ts  | cat 
diff --git a/ts/gh-auth-test/src/auth.ts b/ts/gh-auth-test/src/auth.ts
index e39a78d..05b27c1 100644
--- a/ts/gh-auth-test/src/auth.ts
+++ b/ts/gh-auth-test/src/auth.ts
@@ -1,5 +1,5 @@
 import { SvelteKitAuth } from '@auth/sveltekit';
-import GitHub from '@auth/sveltekit/providers/github';
+import { SAML } from '@auth/core/providers/saml';
 import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private';
 
 function logObjectDetails(name: string, my_obj: unknown) {
@@ -22,7 +22,28 @@ function logObjectDetails(name: string, my_obj: unknown) {
 
 // GitHub talks BACK to our application, it is handled by the "handle" here
 export const { handle } = SvelteKitAuth({
-	providers: [GitHub({ clientId: GH_CLIENT_ID, clientSecret: GH_CLIENT_SECRET })],
+	providers: [
+		SAML({
+			id: 'github',
+			name: 'GitHub Enterprise',
+			clientId: GH_CLIENT_ID,
+			clientSecret: GH_CLIENT_SECRET,
+			issuer: 'https://github.com/enterprises/YOUR_ENTERPRISE_NAME/saml',
+			authorization: {
+				params: {
+					scope: 'read:user user:email'
+				}
+			},
+			profile(profile) {
+				return {
+					id: profile.id,
+					name: profile.name,
+					email: profile.email,
+					image: profile.avatar_url
+				};
+			}
+		})
+	],
 	callbacks: {
 		// JWT get sent to server?
 		async jwt({ token, account }) {
```

