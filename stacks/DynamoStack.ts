import {
  App,
  Stack,
  StackProps,
  Table,
  TableFieldType,
} from "@serverless-stack/resources";

export default class DynamoStack extends Stack {
  readonly table: Table;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, "Scores", {
      fields: {
        name: TableFieldType.STRING,
        date: TableFieldType.STRING,
        time: TableFieldType.NUMBER,
        ttl: TableFieldType.NUMBER,
      },
      primaryIndex: { partitionKey: "name", sortKey: "date" },
      dynamodbTable: { timeToLiveAttribute: "ttl" },
    });
  }
}
