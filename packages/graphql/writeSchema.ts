import { createWriteStream, readFileSync } from "fs";

const schema = readFileSync("./schema.graphql").toString();
const writer = createWriteStream("../functions/api/src/schema.ts");
writer.write('import { gql } from "apollo-server-lambda";\n\n');
writer.write(`export const typeDefs = gql\`\n${schema}\`;`);
writer.close();
