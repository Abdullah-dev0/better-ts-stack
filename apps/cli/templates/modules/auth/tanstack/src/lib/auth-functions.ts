import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth, socialProviders } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  return session;
});

// GitHub and Google, when their keys are set; read on the server, where the
// environment variables are
export const getSocialProviders = createServerFn({ method: "GET" }).handler(
  () => socialProviders
);
