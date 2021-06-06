import { AmplitudeClient } from 'amplitude-js';

let amplitudeClient: AmplitudeClient | null = null;
let initialized = false;

export const initializeAmplitude = (apiKey: string): Promise<AmplitudeClient | null> => {
  return new Promise((resolve) => {
    if (initialized) {
      resolve(amplitudeClient);

      return;
    }

    // eslint-disable-next-line
    require('amplitude-js')
      .getInstance()
      .init(apiKey, 'unknown', {}, async (client: AmplitudeClient) => {
        initialized = true;
        amplitudeClient = client;
        resolve(client);
      });
  });
};
