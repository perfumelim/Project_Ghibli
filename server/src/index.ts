import express from 'express';
import http from 'http';
import 'reflect-metadata';
import createApolloServer from './apollo/createApolloServer';
import { createConnection } from './db/db-client';
import cookieParser from 'cookie-parser';

async function main() {
  await createConnection();
  const app = express();
  app.use(cookieParser());

  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({app,
  cors: {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  }
  })

  const httpServer = http.createServer(app);

  httpServer.listen(process.env.PORT || 4000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
          server started on => http://localhost:4000
          graphql playground => http://localhost:4000/graphql`);
    } else {
      console.log(`Production server Started...`);
    }
  });
}

main().catch((err) => console.error(err));
