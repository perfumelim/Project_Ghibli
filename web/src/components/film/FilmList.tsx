import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { Waypoint } from 'react-waypoint';
import { useFilmsQuery } from '../../generated/graphql';
import FilmCard from './FilmCard';

export default function FilmList(): JSX.Element {
  const LIMIT = 6;
  const { loading, error, data, fetchMore } = useFilmsQuery({
    variables: {
      limit: LIMIT,
      cursor: 1,
    },
  });

  if (error) return <p>{error.message}</p>;

  return (
    <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
      {loading && new Array(6).fill(0).map((x) => <Skeleton key={`skeleton_${x}` + Math.random()} height="400px" />)}
      {!loading &&
        data &&
        data.films.films.map((film, i) => (
          <Box key={`film_${film.id}`}>
            {data.films.cursor && i === data.films.films.length - LIMIT / 2 && (
              <Waypoint
                onEnter={() => {
                  fetchMore({
                    variables: {
                      limit: LIMIT,
                      cursor: data.films.cursor,
                    },
                  });
                }}
              />
            )}
            <FilmCard film={film} />
          </Box>
        ))}
    </SimpleGrid>
  );
}
