import { FirebaseConfig } from './models';

let initialized = false;
let client: any = null;

export function initializeFirebase(config: FirebaseConfig) {
  if (initialized === true) {
    return client;
  }

  const firebase = require('firebase/app'); // eslint-disable-line
  require('firebase/analytics'); // eslint-disable-line

  firebase.initializeApp(config);
  firebase.analytics();
  initialized = true;
  client = firebase;

  return client;
}
