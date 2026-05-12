import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const getProxyTarget = () => {
  if (process.env.ASPNETCORE_HTTPS_PORT) {
    return `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`;
  }

  if (process.env.ASPNETCORE_URLS) {
    return process.env.ASPNETCORE_URLS.split(";")[0];
  }

  return "http://localhost:61423";
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const certFile = env.SSL_CRT_FILE;
  const keyFile = env.SSL_KEY_FILE;
  const https =
    certFile && keyFile && fs.existsSync(certFile) && fs.existsSync(keyFile)
      ? {
          cert: fs.readFileSync(certFile),
          key: fs.readFileSync(keyFile),
        }
      : undefined;

  return {
    plugins: [react()],
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.PORT) || 44453,
      strictPort: true,
      https,
      proxy: {
        "/api": {
          target: getProxyTarget(),
          secure: false,
          changeOrigin: true,
        },
        "/swagger": {
          target: getProxyTarget(),
          secure: false,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    test: {
      environment: "jsdom",
    },
  };
});
