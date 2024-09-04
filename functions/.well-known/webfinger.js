export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Log the incoming request URL and headers
    console.log("Request URL:", url.toString());
    console.log("Request Headers:", JSON.stringify(request.headers));

    // Parse the query parameters
    const resource = url.searchParams.get('resource');

    // Log the parsed parameters
    console.log("Resource Parameter:", resource);

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

        // Log the response that will be sent
        console.log("WebFinger Response:", JSON.stringify(webfingerResponse));

        return new Response(JSON.stringify(webfingerResponse), {
            headers: {
                'Content-Type': 'application/jrd+json', // Set the correct content type
            },
        });
    } else {
        // Log invalid parameter case
        console.log('Invalid resource or rel parameter');
        return new Response('Invalid resource parameter', { status: 400 });
    }
}
