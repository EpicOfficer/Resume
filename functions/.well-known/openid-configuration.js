export async function onRequest(context) {
    const { env } = context;

    // Serve the OpenID configuration
    const openidConfiguration = {
        issuer: env.OIDC_ISSUER_URL,
        authorization_endpoint: env.OIDC_AUTHORIZATION_ENDPOINT,
        token_endpoint: env.OIDC_TOKEN_ENDPOINT,
        userinfo_endpoint: env.OIDC_USERINFO_ENDPOINT,
        jwks_uri: env.OIDC_JWKS_URI,
    };

    return new Response(JSON.stringify(openidConfiguration), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
