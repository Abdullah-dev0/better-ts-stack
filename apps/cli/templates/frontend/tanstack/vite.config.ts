import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command, isPreview }) => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({ srcDirectory: "src" }),
    tailwindcss(),
    viteReact(),
    // Nitro builds the production server in .output/ (run with node) and serves
    // it for `vite preview`. It is left out of `vite dev`, where TanStack Start's
    // own dev server is steadier
    (command === "build" || isPreview) && nitro(),
  ],
}));
