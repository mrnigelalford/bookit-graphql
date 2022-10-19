import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Author } from '../Types/Author.type';

export default class Authors extends MongoDataSource<Author> {

  getAuthorByID (id: string) {
    return this.collection.findOne({"name": "Nigel Alford"})
  }

  // NOTE: This is not being used yet
  setAuthor (props: Author) {
    this.collection
      .insertOne({
        name: props.name,
        bioLink: props.bioLink,
        sales: props.sales,
        img: props.img,
      })
      .then((res) => {
        console.log('insert successful: ', res);
      });

    return 'success';
  };
}
