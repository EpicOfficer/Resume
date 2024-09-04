export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Parse the query parameters
    const resource = url.searchParams.get('resource');

    // Validate the resource and rel parameters
    if (resource && resource.startsWith('acct:') ) {
        const account = resource.substring(5);

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
        // Return a 400 Bad Request for invalid requests
        return new Response('Invalid resource parameter', { status: 400 });
    }
}
