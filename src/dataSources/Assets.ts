import { MongoDataSource } from 'apollo-datasource-mongodb'
import { MongoClient } from 'mongodb';
import { NFT } from '../Types/NFT.type';

export default class Asset extends MongoDataSource<NFT> {
  client = new MongoClient(process.env.mongoURL);

  getAssetByID(id: string) {
    return this.findOneById(id);
  }

  // getAllAssets() {
  //   return this.findManyByIds ();
  // }

  setAsset = async (props: NFT) => {
    const session = await this.client.connect();

    session
      .db(process.env.dbName)
      .collection('assets')
      .insertOne({
        title: props.title,
        description: props.description,
        price: props.price,
        category: props.category,
        token: props.token,
        fullImg: props.fullImg,
        previewImg: props.previewImg,
      })
      .then((res) => {
        console.log('insert successful: ', res);
        session.close();
      });

    return 'success';
  };
}
