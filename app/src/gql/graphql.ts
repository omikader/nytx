/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Player = {
  __typename?: 'Player';
  averageTime?: Maybe<Scalars['String']['output']>;
  bestScore?: Maybe<Score>;
  gamesPlayed: Scalars['Int']['output'];
  lastPlay?: Maybe<Scalars['String']['output']>;
  maxStreak: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  streak: Scalars['Int']['output'];
  worstScore?: Maybe<Score>;
};

export type Query = {
  __typename?: 'Query';
  activeLeaderboard: Array<Score>;
  headToHead: Series;
  leaderboard: Array<Score>;
  nextPuzzleDateTime: Scalars['DateTime']['output'];
  player: Player;
  ratings: Array<Rating>;
};


export type QueryHeadToHeadArgs = {
  excludeMidis: Scalars['Boolean']['input'];
  name1: Scalars['String']['input'];
  name2: Scalars['String']['input'];
};


export type QueryLeaderboardArgs = {
  date: Scalars['String']['input'];
};


export type QueryPlayerArgs = {
  excludeMidis: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type Rating = {
  __typename?: 'Rating';
  date: Scalars['String']['output'];
  eta: Scalars['Float']['output'];
  mu: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  sigma: Scalars['Float']['output'];
};

export type Score = {
  __typename?: 'Score';
  date: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  time: Scalars['String']['output'];
};

export type Series = {
  __typename?: 'Series';
  losses: Scalars['Int']['output'];
  stats1: Stats;
  stats2: Stats;
  ties: Scalars['Int']['output'];
  wins: Scalars['Int']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  avg: Scalars['String']['output'];
};

export type PuzzleContextQueryVariables = Exact<{ [key: string]: never; }>;


export type PuzzleContextQuery = { __typename?: 'Query', nextPuzzleDateTime: string, activeLeaderboard: Array<{ __typename?: 'Score', name: string, date: string, time: string, rank: string }> };

export type HeadToHeadQueryVariables = Exact<{
  name1: Scalars['String']['input'];
  name2: Scalars['String']['input'];
  excludeMidis: Scalars['Boolean']['input'];
}>;


export type HeadToHeadQuery = { __typename?: 'Query', headToHead: { __typename?: 'Series', wins: number, losses: number, ties: number, stats1: { __typename?: 'Stats', avg: string }, stats2: { __typename?: 'Stats', avg: string } } };

export type PlayerModalQueryVariables = Exact<{
  name: Scalars['String']['input'];
  excludeMidis: Scalars['Boolean']['input'];
}>;


export type PlayerModalQuery = { __typename?: 'Query', player: { __typename?: 'Player', gamesPlayed: number, streak: number, maxStreak: number, lastPlay?: string | null, averageTime?: string | null, bestScore?: { __typename?: 'Score', date: string, time: string } | null, worstScore?: { __typename?: 'Score', date: string, time: string } | null } };

export type RatingsQueryVariables = Exact<{ [key: string]: never; }>;


export type RatingsQuery = { __typename?: 'Query', ratings: Array<{ __typename?: 'Rating', name: string, date: string, eta: number }> };


export const PuzzleContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PuzzleContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextPuzzleDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"activeLeaderboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}}]}}]}}]} as unknown as DocumentNode<PuzzleContextQuery, PuzzleContextQueryVariables>;
export const HeadToHeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HeadToHead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeMidis"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headToHead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name1"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name1"}}},{"kind":"Argument","name":{"kind":"Name","value":"name2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name2"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeMidis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeMidis"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wins"}},{"kind":"Field","name":{"kind":"Name","value":"losses"}},{"kind":"Field","name":{"kind":"Name","value":"ties"}},{"kind":"Field","name":{"kind":"Name","value":"stats1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avg"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avg"}}]}}]}}]}}]} as unknown as DocumentNode<HeadToHeadQuery, HeadToHeadQueryVariables>;
export const PlayerModalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerModal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeMidis"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeMidis"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeMidis"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gamesPlayed"}},{"kind":"Field","name":{"kind":"Name","value":"streak"}},{"kind":"Field","name":{"kind":"Name","value":"maxStreak"}},{"kind":"Field","name":{"kind":"Name","value":"lastPlay"}},{"kind":"Field","name":{"kind":"Name","value":"averageTime"}},{"kind":"Field","name":{"kind":"Name","value":"bestScore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"worstScore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]} as unknown as DocumentNode<PlayerModalQuery, PlayerModalQueryVariables>;
export const RatingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ratings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"eta"}}]}}]}}]} as unknown as DocumentNode<RatingsQuery, RatingsQueryVariables>;