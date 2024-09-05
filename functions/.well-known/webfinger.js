export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Validate the resource and rel parameters
    if (resource && resource.startsWith('acct:')) {
        // Construct the WebFinger response using environment variables
        const webfingerResponse = {
            "subject": resource,
            "links": [
                {
                    "rel": "http://openid.net/specs/connect/1.0/issuer",
                    "href": env.OIDC_ISSUER_URL
                }
            ]
        };

        return new Response(JSON.stringify(webfingerResponse), {
            headers: {
                'Content-Type': 'application/jrd+json', // Set the correct content type
            },
        });
    } else {
        return new Response('Invalid resource parameter', { status: 400 });
    }
}
