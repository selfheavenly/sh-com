import { readFile } from "node:fs/promises";

const envValue = process.env.VITE_API_BASE_URL?.trim();
const fileValue = await readProductionEnvValue();
const value = envValue || fileValue;

if (!value || value.includes("REPLACE_WITH_AZURE_BACKEND_URL")) {
  console.error(
    [
      "Set VITE_API_BASE_URL before deploying to GitHub Pages.",
      "Example:",
      "  VITE_API_BASE_URL=https://actual-azure-url/api bun run deploy",
      "or create .env.production from .env.production.example.",
    ].join("\n"),
  );
  process.exit(1);
}

async function readProductionEnvValue() {
  try {
    const content = await readFile(".env.production", "utf8");
    const line = content
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith("VITE_API_BASE_URL="));
    return line?.split("=").slice(1).join("=").trim();
  } catch {
    return "";
  }
}
