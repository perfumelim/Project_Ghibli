import { gql, useQuery } from '@apollo/client';

interface Film {
  id: number;
  title: string;
  subtitile: string;
}

type FileQueryResult = { films: Film[] };

const FILMS_QUERY = gql`
  query ExampleQuery {
    films {
      id
      title
      subtitle
    }
  }
`;

export default function FilmList() {
  const { data, loading, error } = useQuery<FileQueryResult>(FILMS_QUERY);

  if (loading) return <p> ... loading</p>;
  if (error) return <p>{error.message}</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
