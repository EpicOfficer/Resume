export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Handle only requests to the WebFinger endpoint
    if (url.pathname === '/.well-known/webfinger') {
        // Parse the query parameters
        const resource = url.searchParams.get('resource');
        const rel = url.searchParams.get('rel');

        // Validate the resource and rel parameters
        if (
            resource &&
            resource.startsWith('acct:') &&
            rel === 'http://openid.net/specs/connect/1.0/issuer'
        ) {
            const account = resource.substring(5);

            // Construct the WebFinger response using environment variables
            const webfingerResponse = {
                "subject": resource,
                "links": [
                    {
                        "rel": "http://openid.net/specs/connect/1.0/issuer",
                        "href": env.OIDC_ISSUER_URL  // Use OIDC issuer URL from environment variable
                    }
                ]
            };

            return new Response(JSON.stringify(webfingerResponse), {
                headers: {
                    'Content-Type': 'application/jrd+json', // Set the correct content type
                },
            });
        } else {
            // Return a 400 Bad Request for invalid requests
            return new Response('Invalid resource or rel parameter', { status: 400 });
        }
    }

    // Return a 404 for any other requests
    return new Response('Not found', { status: 404 });
}
