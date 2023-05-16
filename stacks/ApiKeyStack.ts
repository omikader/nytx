import { Config, StackContext } from "sst/constructs";

export const ApiKeyStack = ({ stack }: StackContext) => {
  return { NYT_S: new Config.Secret(stack, "NYT-S") };
};
