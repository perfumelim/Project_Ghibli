import * as React from 'react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider, Box, Text, theme } from '@chakra-ui/react';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box>
        <Text>Ghibli GraphQL</Text>
      </Box>
    </ChakraProvider>
  </ApolloProvider>
);
