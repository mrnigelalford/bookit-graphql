import { MongoDataSource } from 'apollo-datasource-mongodb'
import { MongoClient } from 'mongodb';
import { Author } from '../Types/Author.type';

export default class Authors extends MongoDataSource<Author> {
  client = new MongoClient(process.env.mongoURL);

  getAuthorByID(id: string) {
    return this.findOneById(id);
  }

  setAuthor = async (props: Author) => {
    const session = await this.client.connect();
    session
      .db(process.env.dbName)
      .collection('authors')
      .insertOne({
        name: props.name,
        bioLink: props.bioLink,
        sales: props.sales,
        img: props.img,
      })
      .then((res) => {
        console.log('insert successful: ', res);
        session.close();
      });

    return 'success';
  };
}
