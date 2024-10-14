import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import dotenv from "dotenv";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_GOOGLE_API_KEY": JSON.stringify(
      process.env.VITE_GOOGLE_API_KEY
    ),
    "process.env.VITE_OPENAI_API_KEY": JSON.stringify(
      process.env.VITE_OPENAI_API_KEY
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
