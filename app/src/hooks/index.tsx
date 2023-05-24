import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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
  bestScore?: Maybe<Score>;
  gamesPlayed: Scalars['Int']['output'];
  lastPlay: Scalars['String']['output'];
  maxStreak: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  streak: Scalars['Int']['output'];
  worstScore?: Maybe<Score>;
};


export type PlayerBestScoreArgs = {
  excludeMidis: Scalars['Boolean']['input'];
};


export type PlayerWorstScoreArgs = {
  excludeMidis: Scalars['Boolean']['input'];
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

export type PuzzleQueryVariables = Exact<{ [key: string]: never; }>;


export type PuzzleQuery = { __typename?: 'Query', nextPuzzleDateTime: string, activeLeaderboard: Array<{ __typename?: 'Score', name: string, date: string, time: string, rank: string }> };

export type HeadToHeadQueryVariables = Exact<{
  name1: Scalars['String']['input'];
  name2: Scalars['String']['input'];
  excludeMidis: Scalars['Boolean']['input'];
}>;


export type HeadToHeadQuery = { __typename?: 'Query', headToHead: { __typename?: 'Series', wins: number, losses: number, ties: number, stats1: { __typename?: 'Stats', avg: string }, stats2: { __typename?: 'Stats', avg: string } } };

export type RatingsQueryVariables = Exact<{ [key: string]: never; }>;


export type RatingsQuery = { __typename?: 'Query', ratings: Array<{ __typename?: 'Rating', name: string, date: string, mu: number, sigma: number, eta: number }> };


export const PuzzleDocument = gql`
    query Puzzle {
  activeLeaderboard {
    name
    date
    time
    rank
  }
  nextPuzzleDateTime
}
    `;

/**
 * __usePuzzleQuery__
 *
 * To run a query within a React component, call `usePuzzleQuery` and pass it any options that fit your needs.
 * When your component renders, `usePuzzleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePuzzleQuery({
 *   variables: {
 *   },
 * });
 */
export function usePuzzleQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PuzzleQuery, PuzzleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PuzzleQuery, PuzzleQueryVariables>(PuzzleDocument, options);
      }
export function usePuzzleLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PuzzleQuery, PuzzleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PuzzleQuery, PuzzleQueryVariables>(PuzzleDocument, options);
        }
export type PuzzleQueryHookResult = ReturnType<typeof usePuzzleQuery>;
export type PuzzleLazyQueryHookResult = ReturnType<typeof usePuzzleLazyQuery>;
export type PuzzleQueryResult = ApolloReactCommon.QueryResult<PuzzleQuery, PuzzleQueryVariables>;
export const HeadToHeadDocument = gql`
    query HeadToHead($name1: String!, $name2: String!, $excludeMidis: Boolean!) {
  headToHead(name1: $name1, name2: $name2, excludeMidis: $excludeMidis) {
    wins
    losses
    ties
    stats1 {
      avg
    }
    stats2 {
      avg
    }
  }
}
    `;

/**
 * __useHeadToHeadQuery__
 *
 * To run a query within a React component, call `useHeadToHeadQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeadToHeadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeadToHeadQuery({
 *   variables: {
 *      name1: // value for 'name1'
 *      name2: // value for 'name2'
 *      excludeMidis: // value for 'excludeMidis'
 *   },
 * });
 */
export function useHeadToHeadQuery(baseOptions: ApolloReactHooks.QueryHookOptions<HeadToHeadQuery, HeadToHeadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<HeadToHeadQuery, HeadToHeadQueryVariables>(HeadToHeadDocument, options);
      }
export function useHeadToHeadLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HeadToHeadQuery, HeadToHeadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<HeadToHeadQuery, HeadToHeadQueryVariables>(HeadToHeadDocument, options);
        }
export type HeadToHeadQueryHookResult = ReturnType<typeof useHeadToHeadQuery>;
export type HeadToHeadLazyQueryHookResult = ReturnType<typeof useHeadToHeadLazyQuery>;
export type HeadToHeadQueryResult = ApolloReactCommon.QueryResult<HeadToHeadQuery, HeadToHeadQueryVariables>;
export const RatingsDocument = gql`
    query Ratings {
  ratings {
    name
    date
    mu
    sigma
    eta
  }
}
    `;

/**
 * __useRatingsQuery__
 *
 * To run a query within a React component, call `useRatingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRatingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRatingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRatingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RatingsQuery, RatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RatingsQuery, RatingsQueryVariables>(RatingsDocument, options);
      }
export function useRatingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RatingsQuery, RatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RatingsQuery, RatingsQueryVariables>(RatingsDocument, options);
        }
export type RatingsQueryHookResult = ReturnType<typeof useRatingsQuery>;
export type RatingsLazyQueryHookResult = ReturnType<typeof useRatingsLazyQuery>;
export type RatingsQueryResult = ApolloReactCommon.QueryResult<RatingsQuery, RatingsQueryVariables>;