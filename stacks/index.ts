import { App } from "@serverless-stack/resources";

import { ApiKeyStack } from "./ApiKeyStack";
import { ApolloStack } from "./ApolloStack";
import { ClientStack } from "./ClientStack";
import { CronStack } from "./CronStack";
import { DynamoStack } from "./DynamoStack";

export default function main(app: App): void {
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
}
