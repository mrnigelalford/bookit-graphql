import {
  contractStorage,
  multiAdminStorage,
  nftStorage,
} from '@oxheadalpha/fa2-interfaces';
import axios from 'axios';

export interface StorageProps {
  owner: string;
  metadata: string;
}

export const createStorage = contractStorage
  .with(multiAdminStorage)
  .with(nftStorage).build;

export const setPinata = async () => {
  return axios
    .get(process.env.pinata_url, {
      headers: {
        pinata_api_key: process.env.pinata_api_key,
        pinata_secret_api_key: process.env.pinata_secret_key,
      },
    })
    .then(function (response) {
      console.log('success: ', response);
    })
    .catch(function (error) {
      console.log('error: ', error);
    });
};

// get pinata api key and secret key from https://pinata.cloud/dashboard
// store data in pinata and get back ipfs hash
// store ipfs hash in storage via graphql mutation
// update graphql mutation schema to include document fields (description, tags, image, etc)
// run all these steps to complete a mint flow -> create collection -> add document to ipfs -> store ipfs url on blockchain
