import {
  App,
  Stack,
  StackProps,
  Table,
  TableFieldType,
} from "@serverless-stack/resources";

export default class DynamoStack extends Stack {
  readonly usersTable: Table;
  readonly scoresTable: Table;
  readonly ratingsTable: Table;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, "Users", {
      fields: { name: TableFieldType.STRING },
      primaryIndex: { partitionKey: "name" },
    });

    this.scoresTable = new Table(this, "Scores", {
      fields: {
        name: TableFieldType.STRING,
        date: TableFieldType.STRING,
        year: TableFieldType.NUMBER,
      },
      primaryIndex: { partitionKey: "name", sortKey: "date" },
      globalIndexes: {
        yearDateIndex: {
          partitionKey: "year",
          sortKey: "date",
        },
      },
    });

    this.ratingsTable = new Table(this, "Ratings", {
      fields: {
        name: TableFieldType.STRING,
        date: TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "name", sortKey: "date" },
    });
  }
}
