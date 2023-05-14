import { GraphQLResolveInfo } from 'graphql';
import { IContext } from './index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Entry: ResolverTypeWrapper<Entry>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Leaderboard: ResolverTypeWrapper<Leaderboard>;
  Query: ResolverTypeWrapper<{}>;
  Rating: ResolverTypeWrapper<Rating>;
  Score: ResolverTypeWrapper<Score>;
  Stats: ResolverTypeWrapper<Stats>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Entry: Entry;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Leaderboard: Leaderboard;
  Query: {};
  Rating: Rating;
  Score: Score;
  Stats: Stats;
  String: Scalars['String'];
  User: User;
}>;

export type EntryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Entry'] = ResolversParentTypes['Entry']> = ResolversObject<{
  losses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stats1?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  stats2?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  ties?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeaderboardResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Leaderboard'] = ResolversParentTypes['Leaderboard']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ratings?: Resolver<Array<Maybe<ResolversTypes['Rating']>>, ParentType, ContextType>;
  scores?: Resolver<Array<Maybe<ResolversTypes['Score']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  countUserFinishesAboveK?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryCountUserFinishesAboveKArgs, 'name' | 'rank'>>;
  headToHeadRecord?: Resolver<ResolversTypes['Entry'], ParentType, ContextType, RequireFields<QueryHeadToHeadRecordArgs, 'name1' | 'name2'>>;
  latestRatings?: Resolver<Array<Maybe<ResolversTypes['Rating']>>, ParentType, ContextType>;
  leaderboards?: Resolver<Array<Maybe<ResolversTypes['Leaderboard']>>, ParentType, ContextType, RequireFields<QueryLeaderboardsArgs, 'end' | 'start'>>;
  userRatings?: Resolver<Array<Maybe<ResolversTypes['Rating']>>, ParentType, ContextType, RequireFields<QueryUserRatingsArgs, 'name'>>;
  userRatingsInDateRange?: Resolver<Array<Maybe<ResolversTypes['Rating']>>, ParentType, ContextType, RequireFields<QueryUserRatingsInDateRangeArgs, 'end' | 'name' | 'start'>>;
  userScores?: Resolver<Array<Maybe<ResolversTypes['Score']>>, ParentType, ContextType, RequireFields<QueryUserScoresArgs, 'name'>>;
  userScoresInDateRange?: Resolver<Array<Maybe<ResolversTypes['Score']>>, ParentType, ContextType, RequireFields<QueryUserScoresInDateRangeArgs, 'end' | 'name' | 'start'>>;
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
}>;

export type RatingResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eta?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  mu?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sigma?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScoreResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Score'] = ResolversParentTypes['Score']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatsResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats']> = ResolversObject<{
  avg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  first?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  second?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  third?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  currentStreak?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gamesPlayed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  maxStreak?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = IContext> = ResolversObject<{
  Entry?: EntryResolvers<ContextType>;
  Leaderboard?: LeaderboardResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rating?: RatingResolvers<ContextType>;
  Score?: ScoreResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

