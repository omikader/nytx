import { StackContext, Table } from "sst/constructs";

export const DynamoStack = ({ stack }: StackContext) => {
  const usersTable = new Table(stack, "Users", {
    fields: { name: "string" },
    primaryIndex: { partitionKey: "name" },
  });

  const scoresTable = new Table(stack, "Scores", {
    fields: {
      name: "string",
      date: "string",
      year: "number",
    },
    primaryIndex: { partitionKey: "name", sortKey: "date" },
    globalIndexes: {
      yearDateIndex: {
        partitionKey: "year",
        sortKey: "date",
      },
    },
  });

  const ratingsTable = new Table(stack, "Ratings", {
    fields: {
      name: "string",
      date: "string",
      year: "number",
    },
    primaryIndex: { partitionKey: "name", sortKey: "date" },
    globalIndexes: {
      yearDateIndex: {
        partitionKey: "year",
        sortKey: "date",
      },
    },
  });

  return { usersTable, scoresTable, ratingsTable };
};
