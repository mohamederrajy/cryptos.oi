/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Check if the URL starts with /account
    if (event.url.pathname.startsWith('/account')) {
        // Rewrite the request to use the account routes
        event.url.pathname = event.url.pathname.replace('/account', '');
        return resolve(event, {
            transformPageChunk: ({ html }) => html,
            routeId: event.url.pathname
        });
    }
    return resolve(event);
} 