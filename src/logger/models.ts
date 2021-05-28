import { FirebaseConfig } from './firebase/models';

export interface SupportedServices {
  firebase?: FirebaseConfig;
  amplitude?: string;
}

export interface LoggerInitializeConfig {
  services: SupportedServices;
}
