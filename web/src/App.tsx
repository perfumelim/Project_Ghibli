import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Main from './pages/Main';
import Film from './pages/Film';
import { createApolloClient } from './apollo/createApolloClient';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';

const apolloClient = createApolloClient();

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/film/:filmId" element={<Film />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </ApolloProvider>
);
