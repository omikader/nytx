import { StackContext, Table } from "sst/constructs";

export const DynamoStack = ({ stack }: StackContext) => {
  const table = new Table(stack, "Entity", {
    fields: {
      PK: "string",
      SK: "string",
      GSI1PK: "string",
      GSI1SK: "string",
      GSI2PK: "string",
      GSI2SK: "string",
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    globalIndexes: {
      GSI1: {
        partitionKey: "GSI1PK",
        sortKey: "GSI1SK",
      },
      GSI2: {
        partitionKey: "GSI2PK",
        sortKey: "GSI2SK",
      },
    },
  });

  return { table };
};
