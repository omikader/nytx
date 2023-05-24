import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../functions/api/src/schema.ts",
  documents: "../../app/src/**/*.gql",
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
    "../../app/src/hooks/index.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        apolloReactCommonImportFrom: "@apollo/client",
        apolloReactHooksImportFrom: "@apollo/client",
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
