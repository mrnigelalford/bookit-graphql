import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Author } from '../Types/Author.type';

export default class Authors extends MongoDataSource<Author> {

  getAuthorByAddress(address: string) {
    return this.collection.findOne({ address })
  }

  async setAuthorByAddress({ address }: Author) {
    try {
      const res = await this.collection
        .insertOne({
          address
        });
      console.log('res: ', res);
      return res;
    } catch (e) {
      return e;
    }
  };
}
