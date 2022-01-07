import {
  ApolloApi,
  App,
  ReactStaticSite,
  Stack,
  StackProps,
} from "@serverless-stack/resources";

export interface ClientStackProps extends StackProps {
  api: ApolloApi;
}

export default class ClientStack extends Stack {
  constructor(scope: App, id: string, props?: ClientStackProps) {
    super(scope, id, props);

    const { api } = props!;

    const site = new ReactStaticSite(this, "ReactSite", {
      customDomain:
        scope.stage === "prod"
          ? {
              domainName: "nytx.omikader.com",
              domainAlias: "www.nytx.omikader.com",
              hostedZone: "omikader.com",
            }
          : undefined,
      path: "client",
      environment: {
        REACT_APP_API_URL: api.customDomainUrl || api.url,
        REACT_APP_REGION: scope.region,
      },
    });

    // Show the url in the output
    this.addOutputs({ SiteUrl: site.customDomainUrl || site.url });
  }
}
