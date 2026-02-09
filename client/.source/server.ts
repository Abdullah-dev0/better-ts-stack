// @ts-nocheck
import * as __fd_glob_14 from "../content/docs/modules/index.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/modules/frontend.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/modules/docker.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/modules/database.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/modules/backend.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/modules/auth.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/usage.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/troubleshooting.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/templates.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/structure.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/configuration.mdx?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/modules/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "modules/meta.json": __fd_glob_1, }, {"configuration.mdx": __fd_glob_2, "index.mdx": __fd_glob_3, "installation.mdx": __fd_glob_4, "structure.mdx": __fd_glob_5, "templates.mdx": __fd_glob_6, "troubleshooting.mdx": __fd_glob_7, "usage.mdx": __fd_glob_8, "modules/auth.mdx": __fd_glob_9, "modules/backend.mdx": __fd_glob_10, "modules/database.mdx": __fd_glob_11, "modules/docker.mdx": __fd_glob_12, "modules/frontend.mdx": __fd_glob_13, "modules/index.mdx": __fd_glob_14, });