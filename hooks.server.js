/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // This entire block can be removed since we're not using /account routes anymore
    if (event.url.pathname.startsWith('/account')) {
        event.url.pathname = event.url.pathname.replace('/account', '');
        return resolve(event, {
            transformPageChunk: ({ html }) => html,
            routeId: event.url.pathname
        });
    }
    return resolve(event);
} 