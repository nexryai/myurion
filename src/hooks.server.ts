import type { Handle } from "@sveltejs/kit";

import { getServer } from "$lib/server/hook";



const handleApi = getServer();

export const handle: Handle = async ({ event, resolve }) => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) {
        return handleApi(request);
    }

    return resolve(event);
};
