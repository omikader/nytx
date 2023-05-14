import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { StackContext } from "sst/constructs";

export const ApiKeyStack = ({ stack }: StackContext) => {
  return {
    apikey: Secret.fromSecretNameV2(stack, "NYT-S", "prod/nytx/apikey"),
  };
};
