import type { SSTConfig } from "sst";

import { ApiKeyStack } from "./stacks/ApiKeyStack";
import { ApolloStack } from "./stacks/ApolloStack";
import { ClientStack } from "./stacks/ClientStack";
import { CronStack } from "./stacks/CronStack";
import { DynamoStack } from "./stacks/DynamoStack";

export default {
  config(_input) {
    return {
      name: "nytx",
      region: "us-west-1",
    };
  },
  stacks(app) {
    // Set default runtime for all functions
    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
    });

    app
      .stack(ApiKeyStack)
      .stack(DynamoStack)
      .stack(CronStack)
      .stack(ApolloStack)
      .stack(ClientStack);
  },
} satisfies SSTConfig;
