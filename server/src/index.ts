import express from 'express';
import http from 'http';
import 'reflect-metadata';
import createApolloServer from './apollo/createApolloServer';
import { createConnection } from './db/db-client';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { createSchema } from './apollo/createSchema';
import { createSubscriptionServer } from './apollo/createSubscriptionServer';

async function main() {
  await createConnection();
  const app = express();
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(graphqlUploadExpress({maxFileSize: 1024 * 1000 * 5, maxFiles: 1}));
  const httpServer = http.createServer(app);

  const schema = await createSchema();
  await createSubscriptionServer(schema, httpServer);
  const apolloServer = await createApolloServer(schema);
  await apolloServer.start();
  apolloServer.applyMiddleware({app,
  cors: {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  }
  })


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
