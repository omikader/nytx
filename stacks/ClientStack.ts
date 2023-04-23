import {
  ReactStaticSite,
  StackContext,
  use,
} from "@serverless-stack/resources";

import { ApolloStack } from "./ApolloStack";

export const ClientStack = ({ app, stack }: StackContext) => {
  const { api } = use(ApolloStack);

  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "client",
    environment: {
      REACT_APP_API_URL: api.customDomainUrl ?? api.url,
      REACT_APP_REGION: app.region,
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
