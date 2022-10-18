import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { typeDefs } from './type-def.js';
import Assets from './dataSources/Assets.js';
import Authors from './dataSources/Authors.js';
import { MongoClient } from 'mongodb';


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    asset: (_, { id }, { dataSources }) => dataSources.assets.getAssetByID(id),
    assets: (_, __, { dataSources }) => dataSources.assets.getAllAssets(),
    authors: (_, __, { dataSources }) => dataSources.authors.getAllAuthors(),
    author: (_, { id }, { dataSources }) =>
      dataSources.authors.getAuthorByID({ id }),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
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

const port = Number.parseInt(process.env.PORT || '4000');
const client = new MongoClient(
  'mongodb+srv://fmark:F5bFfheX3y@foliomarkserverle.lpfzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
client.connect();

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    context: async({req}) => {
      return {
        dataSources: () => ({
          authors: new Authors(client.db('foliomark').collection('authors')),
          assets: new Assets(client.db('foliomark').collection('assets')),
        })
      }
    },
   listen: { port },
});

console.log(`🚀 Server listening at: ${url}`);
