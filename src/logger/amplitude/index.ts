import amplitude, { AmplitudeClient } from 'amplitude-js';

let amplitudeClient: AmplitudeClient | null = null;
let initialized = false;

export const initializeAmplitude = (apiKey: string): Promise<AmplitudeClient | null> => {
  return new Promise((resolve) => {
    if (initialized) {
      resolve(amplitudeClient);

      return;
    }

    // eslint-disable-next-line
    amplitude.getInstance().init(apiKey, 'unknown', {}, async (client: AmplitudeClient) => {
      initialized = true;
      amplitudeClient = client;
      resolve(client);
    });
  });
};

export function getAmplitudeClient() {
  if (amplitudeClient == null) {
    console.error('Amplitude가 아직 초기화되지 않았습니다.');
  }

  return amplitudeClient;
}
