import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IContext } from '../datasources/index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
};

export type Player = {
  __typename?: 'Player';
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
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Player: ResolverTypeWrapper<Player>;
  Query: ResolverTypeWrapper<{}>;
  Rating: ResolverTypeWrapper<Rating>;
  Score: ResolverTypeWrapper<Score>;
  Series: ResolverTypeWrapper<Series>;
  Stats: ResolverTypeWrapper<Stats>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  Player: Player;
  Query: {};
  Rating: Rating;
  Score: Score;
  Series: Series;
  Stats: Stats;
  String: Scalars['String']['output'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type PlayerResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  bestScore?: Resolver<Maybe<ResolversTypes['Score']>, ParentType, ContextType>;
  gamesPlayed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastPlay?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxStreak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  worstScore?: Resolver<Maybe<ResolversTypes['Score']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeLeaderboard?: Resolver<Array<ResolversTypes['Score']>, ParentType, ContextType>;
  headToHead?: Resolver<ResolversTypes['Series'], ParentType, ContextType, RequireFields<QueryHeadToHeadArgs, 'excludeMidis' | 'name1' | 'name2'>>;
  leaderboard?: Resolver<Array<ResolversTypes['Score']>, ParentType, ContextType, RequireFields<QueryLeaderboardArgs, 'date'>>;
  nextPuzzleDateTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType, RequireFields<QueryPlayerArgs, 'excludeMidis' | 'name'>>;
  ratings?: Resolver<Array<ResolversTypes['Rating']>, ParentType, ContextType>;
};

export type RatingResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eta?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  mu?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sigma?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScoreResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Score'] = ResolversParentTypes['Score']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SeriesResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Series'] = ResolversParentTypes['Series']> = {
  losses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stats1?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  stats2?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  ties?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatsResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats']> = {
  avg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = IContext> = {
  DateTime?: GraphQLScalarType;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rating?: RatingResolvers<ContextType>;
  Score?: ScoreResolvers<ContextType>;
  Series?: SeriesResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
};

