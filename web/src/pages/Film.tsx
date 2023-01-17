import { Spinner, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import CommonLayout from '../components/CommonLayout';
import FilmDetail from '../components/film/FilmDetail';
import { useFilmQuery } from '../generated/graphql';

interface FilmPageParams {
  filmId: string;
}

export default function Film() {
  const { filmId } = useParams<FilmPageParams>();
  const { data, loading, error } = useFilmQuery({
    variables: { filmId: Number(filmId) },
  });

  return (
    <CommonLayout>
      {loading && <Spinner />}
      {error && <Text>페이지를 표시할 수 없습니다. </Text>}
      {filmId && data?.film ? <FilmDetail film={data.film} /> : <Text>페이지를 표시할 수 없습니다.</Text>}
    </CommonLayout>
  );
}
