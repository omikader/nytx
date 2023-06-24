/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query PuzzleContext {\n    nextPuzzleDateTime\n    activeLeaderboard {\n      name\n      date\n      time\n      rank\n    }\n  }\n": types.PuzzleContextDocument,
    "\n  query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {\n    headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {\n      wins\n      losses\n      ties\n    }\n  }\n": types.HeadToHeadDocument,
    "\n  query PlayerModal($name: String!, $excludeMidis: Boolean!) {\n    player(name: $name, excludeMidis: $excludeMidis) {\n      gamesPlayed\n      streak\n      maxStreak\n      lastPlay\n      averageTime\n      bestScore {\n        date\n        time\n        seconds\n      }\n      worstScore {\n        date\n        time\n        seconds\n      }\n    }\n  }\n": types.PlayerModalDocument,
    "\n  query Ratings {\n    ratings {\n      name\n      date\n      eta\n    }\n  }\n": types.RatingsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PuzzleContext {\n    nextPuzzleDateTime\n    activeLeaderboard {\n      name\n      date\n      time\n      rank\n    }\n  }\n"): (typeof documents)["\n  query PuzzleContext {\n    nextPuzzleDateTime\n    activeLeaderboard {\n      name\n      date\n      time\n      rank\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {\n    headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {\n      wins\n      losses\n      ties\n    }\n  }\n"): (typeof documents)["\n  query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {\n    headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {\n      wins\n      losses\n      ties\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlayerModal($name: String!, $excludeMidis: Boolean!) {\n    player(name: $name, excludeMidis: $excludeMidis) {\n      gamesPlayed\n      streak\n      maxStreak\n      lastPlay\n      averageTime\n      bestScore {\n        date\n        time\n        seconds\n      }\n      worstScore {\n        date\n        time\n        seconds\n      }\n    }\n  }\n"): (typeof documents)["\n  query PlayerModal($name: String!, $excludeMidis: Boolean!) {\n    player(name: $name, excludeMidis: $excludeMidis) {\n      gamesPlayed\n      streak\n      maxStreak\n      lastPlay\n      averageTime\n      bestScore {\n        date\n        time\n        seconds\n      }\n      worstScore {\n        date\n        time\n        seconds\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Ratings {\n    ratings {\n      name\n      date\n      eta\n    }\n  }\n"): (typeof documents)["\n  query Ratings {\n    ratings {\n      name\n      date\n      eta\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;