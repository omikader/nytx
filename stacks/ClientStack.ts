import { StackContext, StaticSite, use } from "sst/constructs";

import { ApolloStack } from "./ApolloStack";

export const ClientStack = ({ app, stack }: StackContext) => {
  const { api } = use(ApolloStack);

  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/web",
    buildCommand: "yarn build",
    buildOutput: "dist",
    environment: {
      VITE_API_URL: api.customDomainUrl ?? api.url,
    },
    ...(app.stage === "prod" && {
      customDomain: {
        domainName: "nytx.omikader.com",
        domainAlias: "www.nytx.omikader.com",
        hostedZone: "omikader.com",
      },
    }),
  });

  stack.addOutputs({ SiteUrl: site.customDomainUrl ?? site.url });
};
