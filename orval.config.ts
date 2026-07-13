import { defineConfig } from "orval";

export default defineConfig({
  holidash: {
    input: "./openapi-holiday-dashboard.json",
    output: {
      mode: "single",
      target: "./src/api/generated/holiday-dashboard-api.ts",
      schemas: "./src/api/generated/model",
      client: "axios-functions",
      override: {
        mutator: { path: "./src/api/axios-instance.ts", name: "customInstance" },
      },
    },
  },
});
