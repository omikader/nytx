import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** A record represents the head-to-head standings between name1 and name2 */
export type Entry = {
  __typename?: 'Entry';
  /** the number of head-to-head losses for name1 */
  losses: Scalars['Int'];
  /** the stats for name1 on all common puzzles */
  stats1: Stats;
  /** the stats for name2 on all common puzzles */
  stats2: Stats;
  /** the number of ties between name1 and name2 */
  ties: Scalars['Int'];
  /** the number of head-to-head victories for name1 */
  wins: Scalars['Int'];
};

/** A leaderboard is a collection of all puzzle metrics from a single date */
export type Leaderboard = {
  __typename?: 'Leaderboard';
  /** the puzzle date, in YYYY-MM-DD format */
  date: Scalars['String'];
  /** the updated user ratings after the puzzle */
  ratings: Array<Maybe<Rating>>;
  /** the users scores associated with the puzzle */
  scores: Array<Maybe<Score>>;
};

export type Query = {
  __typename?: 'Query';
  /** Count the number of times a user finished a rank or better */
  countUserFinishesAboveK: Scalars['Int'];
  /** Fetch the head-to-head record between two users */
  headToHeadRecord: Entry;
  /** Fetch the latest recorded rating value for all users */
  latestRatings: Array<Maybe<Rating>>;
  /** Fetch all user leaderboards within a YYYY-MM-DD date range */
  leaderboards: Array<Maybe<Leaderboard>>;
  /** Fetch all of a user's ratings */
  userRatings: Array<Maybe<Rating>>;
  /** Fetch a user's ratings within a YYYY-MM-DD date range */
  userRatingsInDateRange: Array<Maybe<Rating>>;
  /** Fetch all of a user's scores */
  userScores: Array<Maybe<Score>>;
  /** Fetch a user's scores within a YYYY-MM-DD date range */
  userScoresInDateRange: Array<Maybe<Score>>;
  /** Fetch all users */
  users: Array<Maybe<User>>;
};


export type QueryCountUserFinishesAboveKArgs = {
  name: Scalars['String'];
  rank: Scalars['Int'];
};


export type QueryHeadToHeadRecordArgs = {
  name1: Scalars['String'];
  name2: Scalars['String'];
};


export type QueryLeaderboardsArgs = {
  end: Scalars['String'];
  start: Scalars['String'];
};


export type QueryUserRatingsArgs = {
  name: Scalars['String'];
};


export type QueryUserRatingsInDateRangeArgs = {
  end: Scalars['String'];
  name: Scalars['String'];
  start: Scalars['String'];
};


export type QueryUserScoresArgs = {
  name: Scalars['String'];
};


export type QueryUserScoresInDateRangeArgs = {
  end: Scalars['String'];
  name: Scalars['String'];
  start: Scalars['String'];
};

/** A rating is the TrueSkill rating for a particular user on a particular date */
export type Rating = {
  __typename?: 'Rating';
  /** the date of the rating, in YYYY-MM-DD format */
  date: Scalars['String'];
  /** the conservative TrueSkill estimate */
  eta: Scalars['Float'];
  /** the rating mean */
  mu: Scalars['Float'];
  /** the rating uncertainty */
  sigma: Scalars['Float'];
  /** the user to which the rating belongs */
  user: User;
};

/** A score is the user data from a given puzzle */
export type Score = {
  __typename?: 'Score';
  /** the date of the score, in YYYY-MM-DD format */
  date: Scalars['String'];
  /** the user rank amongst all users who finished the puzzle */
  rank: Scalars['Int'];
  /** the time to finish the puzzle, as a duration string */
  time: Scalars['String'];
  /** the user who achieved the score */
  user: User;
};

/** Stats are metadata for a particular user on a set of puzzles */
export type Stats = {
  __typename?: 'Stats';
  /** the average time to complete a set of puzzles */
  avg: Scalars['Float'];
  /** the number of first place finishes on a set of puzzles */
  first: Scalars['Int'];
  /** the number of second place finishes on a set of puzzles */
  second: Scalars['Int'];
  /** the number of third place finishes on a set of puzzles */
  third: Scalars['Int'];
};

/** A user represents an entity that solves NYT mini puzzles */
export type User = {
  __typename?: 'User';
  /** the current number of consecutively completed puzzles by the user */
  currentStreak?: Maybe<Scalars['Int']>;
  /** the number of completed puzzles by the user */
  gamesPlayed?: Maybe<Scalars['Int']>;
  /** the maximum number of consecutively completed puzzles by the user */
  maxStreak?: Maybe<Scalars['Int']>;
  /** the name of the user */
  name: Scalars['String'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', name: string, gamesPlayed?: number | null, currentStreak?: number | null, maxStreak?: number | null } | null> };


export const GetUsersDocument = gql`
    query GetUsers {
  users {
    name
    gamesPlayed
    currentStreak
    maxStreak
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = ApolloReactCommon.QueryResult<GetUsersQuery, GetUsersQueryVariables>;