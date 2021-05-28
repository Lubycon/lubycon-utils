import firebase from 'firebase';
import { FirebaseConfig } from './models';

let initialized = false;

export function initializeFirebase(config: FirebaseConfig) {
  if (initialized === true) {
    return;
  }

  firebase.initializeApp(config);
  initialized = true;
}

export default firebase;
