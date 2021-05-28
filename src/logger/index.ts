import { initializeAmplitude } from './amplitude';
import { initializeFirebase } from './firebase';
import { LoggerInitializeConfig } from './models';

function init(config: LoggerInitializeConfig) {
  if (config.services.firebase != null) {
    initializeFirebase(config.services.firebase);
  }
  if (config.services.amplitude != null) {
    initializeAmplitude(config.services.amplitude);
  }
}

export default {
  init,
};
