import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import redis from '../redis/redis-cilent';
import {
  JwtVerifiedUser,
  verifyAccessTokenFromReqHeaders,
} from '../utils/jwt-auth';
import { createCutVoteLoader } from '../dataloaders/cutVoteLoader';
import { GraphQLSchema } from 'graphql';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
  redis: typeof redis;
  cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}

const createApolloServer = async (schema: GraphQLSchema): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: ({ req, res }) => {
      // 액세스 토큰 검증
      const verified = verifyAccessTokenFromReqHeaders(req.headers);
      return {
        req,
        res,
        verifiedUser: verified,
        redis,
        cutVoteLoader: createCutVoteLoader(),
      };
    },
  });
};

export default createApolloServer;