import * as React from 'react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, Box, Text, theme } from '@chakra-ui/react';
import FilmList from './components/film/FilmList';
import { createApolloClient } from './apollo/createApolloClient';

const apolloClient = createApolloClient();

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box>
        <Text>Ghibli GraphQL</Text>
      </Box>
      <FilmList />
    </ChakraProvider>
  </ApolloProvider>
);
