import { DynamoAPI } from "./dynamo";
import { NewYorkTimesAPI } from "./nyt";

export interface IContext {
  dataSources: {
    dynamoAPI: DynamoAPI;
    newYorkTimesAPI: NewYorkTimesAPI;
  };
}

export const context = async () => {
  return {
    dataSources: {
      dynamoAPI: new DynamoAPI(),
      newYorkTimesAPI: new NewYorkTimesAPI(),
    },
  };
};
