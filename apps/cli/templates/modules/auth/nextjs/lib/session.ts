import { cache } from "react";

import { headers } from "next/headers";

import { auth } from "./auth";

// The session of the current request, checked on the server. cache() runs the
// lookup once per request, however many components ask for it, so each part of
// a page can read the session inside its own <Suspense> boundary
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);

// GitHub and Google, when their keys are set; the sign-in and sign-up pages
// show a button for each
export { socialProviders } from "./auth";
