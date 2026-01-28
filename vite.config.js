import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // change to any port you like
    host: true, // optional: allows access from other devices in your network
  },
});
