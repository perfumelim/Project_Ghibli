import {Query, Resolver} from 'type-graphql'
import ghibliData from 'src/data/ghibli'
import { Film } from 'src/entities/Film'

@Resolver(Film)
export class FilmResolver {
  @Query(()=> [Film])
  films(): Film[] {
    return ghibliData.films
  }
}