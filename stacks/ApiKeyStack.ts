import { Config, StackContext } from "sst/constructs";

export const ApiKeyStack = ({ stack }: StackContext) => {
  const NYT_S = new Config.Secret(stack, "NYT-S");
  return { NYT_S };
};
