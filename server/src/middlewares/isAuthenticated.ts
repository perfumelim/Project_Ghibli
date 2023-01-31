import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "../apollo/createApolloServer";
import { verifyAccessToken } from "../utils/jwt-auth";
import { MiddlewareFn } from "type-graphql";

export const isAuthenticated: MiddlewareFn<MyContext> =async ({context}, next, ) => {
  const {authorization} = context.req.headers;
  if(!authorization) throw new AuthenticationError('unauthenticated');
  
  const accessToken = authorization.split(' ')[1];
  verifyAccessToken(accessToken);

  if(!context.verifiedUser) throw new AuthenticationError('unauthenticated');
  return next();
}