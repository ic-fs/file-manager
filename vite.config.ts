import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import tweetnacl from "tweetnacl";

export default defineConfig(async ({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  define: {
    global: "globalThis",
    DEV_PEM:
      mode === "development" ? JSON.stringify(await getDevPem()) : undefined,
    INDEX_CANISTER_ID: JSON.stringify(await getIndexCanisterId(mode)),
  },
  server: {
    fs: {
      allow: ["./src", "../box/src", "./.dfx"],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
}));

async function getDevPem() {
  const pem = await readFile(
    `${process.env.HOME}/.config/dfx/identity/default/identity.pem`,
    "utf-8"
  );

  const data = Buffer.from(
    pem.split("\r\n").filter(Boolean).slice(1, -1).join(""),
    "base64"
  );

  const start = 16;
  const seed = data.slice(start, start + 32);

  const pair = tweetnacl.sign.keyPair.fromSeed(seed);

  return JSON.stringify(
    Ed25519KeyIdentity.fromKeyPair(pair.publicKey, pair.secretKey)
  );
}

async function getIndexCanisterId(mode: string) {
  const json = await readFile(
    mode === "development"
      ? "./.dfx/local/canister_ids.json"
      : "canister_ids.json",
    "utf-8"
  );

  const { index } = JSON.parse(json);
  return mode === "development" ? index.local : index.ic;
}
