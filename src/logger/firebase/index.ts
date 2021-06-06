import FirebaseNamespace from 'firebase/app';
import { isServer } from '../../constants/env';
import { FirebaseConfig } from './models';

type Firebase = typeof FirebaseNamespace;

let initialized = false;
let client: Firebase | null = null;

export function initializeFirebase(config: FirebaseConfig): Promise<Firebase | null> {
  return new Promise(async (resolve) => {
    if (isServer) {
      resolve(null);
    }

    if (initialized === true) {
      resolve(client);
      return;
    }

    const firebaseModule = await import('firebase/app');
    await import('firebase/analytics');

    const firebaseClient = firebaseModule.default;
    firebaseClient.initializeApp(config);
    firebaseClient.analytics();
    initialized = true;
    client = firebaseClient;

    resolve(client);
  });
}
