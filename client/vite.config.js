import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    // `vercel dev` supplies PORT to the framework dev server. Fall back to
    // Vite's usual Curio port when the client is run directly.
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
});
