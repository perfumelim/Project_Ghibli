import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { CutResolver } from "../resolvers/Cut";
import { FilmResolver } from "../resolvers/Film";
import { UserResolver } from "../resolvers/User";
import { buildSchema } from "type-graphql";
import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
}

const createApolloServer =async (): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema: await buildSchema({
      resolvers: [FilmResolver, CutResolver, UserResolver],
    }),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: ({req, res}) => {
      return {req, res}
    }
  })
}

export default createApolloServer;