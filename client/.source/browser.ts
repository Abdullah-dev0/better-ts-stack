// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"configuration.mdx": () => import("../content/docs/configuration.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "structure.mdx": () => import("../content/docs/structure.mdx?collection=docs"), "templates.mdx": () => import("../content/docs/templates.mdx?collection=docs"), "troubleshooting.mdx": () => import("../content/docs/troubleshooting.mdx?collection=docs"), "usage.mdx": () => import("../content/docs/usage.mdx?collection=docs"), "modules/auth.mdx": () => import("../content/docs/modules/auth.mdx?collection=docs"), "modules/backend.mdx": () => import("../content/docs/modules/backend.mdx?collection=docs"), "modules/database.mdx": () => import("../content/docs/modules/database.mdx?collection=docs"), "modules/docker.mdx": () => import("../content/docs/modules/docker.mdx?collection=docs"), "modules/frontend.mdx": () => import("../content/docs/modules/frontend.mdx?collection=docs"), "modules/index.mdx": () => import("../content/docs/modules/index.mdx?collection=docs"), }),
};
export default browserCollections;