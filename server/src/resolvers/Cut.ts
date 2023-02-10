import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Cut } from "../entities/Cut";
import { Film } from "../entities/Film";
import ghibliData from "../data/ghibli";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { MyContext } from "../apollo/createApolloServer";
import { CutVote } from "../entities/CutVote";

@Resolver(Cut)
export class CutResolver {
  @Query(()=> [Cut])
  cuts(@Arg('filmId', ()=> Int) filmId: Film['id']): Cut[] {
    return ghibliData.cuts.filter((x)=> x.filmId === filmId);
  }

  @Query(()=> Cut, {nullable: true})
  cut(@Arg('cutId', ()=> Int) cutId: number):Cut|undefined {
    return ghibliData.cuts.find((x)=> x.id === cutId)
  }

  @FieldResolver(()=> Film, {nullable: true})
  film(@Root()cut: Cut):Film| undefined {
    return ghibliData.films.find((film)=> film.id === cut.filmId)
  }

  @Mutation(()=> Boolean) 
  @UseMiddleware(isAuthenticated)
  async vote(
    @Arg('cutId', ()=> Int) cutId: number,
    @Ctx() {verifiedUser} : MyContext,
  ): Promise<boolean> {
    if(verifiedUser) {
      const {userId} = verifiedUser;
      const alreadyVoted = await CutVote.findOne({
        where: {
          cutId,
          userId,
        }
      });
      if(alreadyVoted) {
        await alreadyVoted.remove();
        return true;
      }
      const vote = CutVote.create({cutId, userId});
      await vote.save();
      return true;
    }
    return false;
  }
} 