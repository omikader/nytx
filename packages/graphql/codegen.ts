import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  generates: {
    "../functions/api/src/resolvers-types.ts": {
      config: {
        contextType: "./index#IContext",
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
