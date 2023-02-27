import { GraphQLSchema } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { CutResolver } from "../resolvers/Cut";
import { CutReviewResolver } from "../resolvers/CutReview";
import { FilmResolver } from "../resolvers/Film";
import { UserResolver } from "../resolvers/User";
import { buildSchema } from "type-graphql";

export const createSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [
      FilmResolver,
      CutResolver,
      UserResolver,
      CutReviewResolver
    ],
    pubSub: new PubSub()
  })
}