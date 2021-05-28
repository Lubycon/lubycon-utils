import firebase from 'firebase/app';
import 'firebase/analytics';
import { FirebaseConfig } from './models';

let initialized = false;

export function initializeFirebase(config: FirebaseConfig) {
  if (initialized === true) {
    return;
  }

  firebase.initializeApp(config);
  firebase.analytics();
  initialized = true;
}

export default firebase;
