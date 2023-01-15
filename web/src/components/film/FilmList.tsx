import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useFilmsQuery } from '../generated/graphql';
import FilmCard from './film/FilmCard';

export default function FlimList(): JSX.Element {
  const { loading, error, data } = useFilmsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
      {loading && new Array(6).fill(0).map((x) => <Skeleton key={x} height="400px" />)}
      {!loading &&
        data &&
        data.films.map((film, i) => (
          <Box key={film.id}>
            <FilmCard film={film} />
          </Box>
        ))}
    </SimpleGrid>
  );
}
