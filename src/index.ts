import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './type-def.js';
import Assets from './dataSources/Assets.js';
import Authors from './dataSources/Authors.js';
import { MongoClient } from 'mongodb';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';

import * as dotenv from 'dotenv'
import { Author } from './Types/Author.type.js';
dotenv.config()

const port = Number.parseInt(process.env.PORT);
const client = new MongoClient(process.env.mongodb);
await client.connect().then(() => console.log('🎉 connected to database successfully'));

client.connect();

const resolvers = {
  Query: {
    asset: (_, { id }, { dataSources }) => dataSources.assets.getAssetByID(id),
    author: (_, { address }, { dataSources }) => dataSources.authors.getAuthorByAddress(address),
  },
  Mutation: {
    setAuthorByAddress: (_, props: Author, { dataSources }) =>
    dataSources.authors.setAuthorByAddress(props)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: 'my-graph-id@my-graph-variant',
          footer: false,
          embed: true,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ]
});

const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      dataSources: {
        authors: new Authors(client.db('foliomark').collection('authors')),
        assets: new Assets(client.db('foliomark').collection('assets')),
      },
    }
  },
  listen: {port}
})


console.log(`🚀 Server listening at: ${url}`);
