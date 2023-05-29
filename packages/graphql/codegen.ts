import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../functions/api/src/schema.ts",
  documents: "../../app/src/**/*.tsx",
  ignoreNoDocuments: true,
  generates: {
    "../functions/api/src/resolvers/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../datasources/index#IContext",
        scalars: {
          DateTime: "Date",
        },
      },
    },
    "../../app/src/gql/": {
      preset: "client",
      config: {
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
