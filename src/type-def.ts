export const typeDefs = `
enum Token {
  XTZ
  WXTZ
  CTEZ
}

type Author {
  _id: ID!
  bioLink: String
  img: String
  name: String!
  sales: Int!
}

type Asset {
  _id: ID!
  url: String
  auctionID: String
  author: Author
  previewImg: String!
  fullImg: String!
  title: String
  price: Int
  token: Token!
  likes: Int
  category: String
  views: Int!
  description: String
}

type Query {
  asset(id: ID): Asset
  author(id: ID): Author
}
`;
