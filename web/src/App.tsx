import * as React from 'react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Main from './pages/Main';
import { createApolloClient } from './apollo/createApolloClient';
import { BrowserRouter, Route } from 'react-router-dom';

const apolloClient = createApolloClient();

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/" component={Main} />
      </BrowserRouter>
    </ChakraProvider>
  </ApolloProvider>
);
