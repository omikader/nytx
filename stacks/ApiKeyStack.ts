import { App, Stack, StackProps } from "@serverless-stack/resources";
import { ISecret, Secret } from "aws-cdk-lib/aws-secretsmanager";

export default class ApiKeyStack extends Stack {
  readonly apikey: ISecret;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.apikey = Secret.fromSecretNameV2(this, "NYT-S", "prod/nytx/apikey");
  }
}
