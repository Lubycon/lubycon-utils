import firebase, { initializeFirebase } from './firebase';
import {
  LoggerEnvMode,
  LoggerEventParams,
  LoggerInitializeConfig,
  LoggerParams,
  SupportedServices,
} from './models';
import { initializeAmplitude, getAmplitudeClient } from './amplitude';
import { TypeMap } from '../models/utils';
import { getKeys } from '../utils';

const initializers: TypeMap<SupportedServices, (arg: any) => void> = {
  firebase: initializeFirebase,
  amplitude: initializeAmplitude,
};

class Logger {
  private mode: LoggerEnvMode = 'production';
  private serviceAvailable: TypeMap<SupportedServices, boolean> = {
    firebase: false,
    amplitude: false,
  };

  public init({ mode, services }: LoggerInitializeConfig) {
    this.mode = mode;

    getKeys(services).forEach((serviceKey) => {
      const initializer = initializers[serviceKey];
      const config = services[serviceKey];
      initializer?.(config);
      this.serviceAvailable[serviceKey] = true;
    }, []);
  }

  private track(logName: string, { view, action, params }: LoggerParams) {
    if (this.mode === 'development') {
      console.table({
        view,
        logName,
        action,
        ...params,
      });
    }

    // 추상화할 것
    if (this.serviceAvailable.firebase === true) {
      firebase.analytics().logEvent(logName, {
        view,
        action,
        ...params,
      });
    }

    if (this.serviceAvailable.amplitude === true) {
      try {
        const amplitude = getAmplitudeClient();
        amplitude?.logEvent(logName, {
          view,
          action,
          ...params,
        });
      } catch (e) {
        return;
      }
    }
  }

  private getView(loggerName: string) {
    return (params: LoggerEventParams = {}) => {
      this.track(`${loggerName}_view`, {
        view: loggerName,
        action: 'view',
        params,
      });
    };
  }

  private getClick(loggerName: string) {
    return (logName: string, params: LoggerEventParams = {}) =>
      this.track(logName, {
        view: loggerName,
        action: 'click',
        params,
      });
  }

  private getImpression(loggerName: string) {
    return (logName: string, params: LoggerEventParams = {}) =>
      this.track(logName, {
        view: loggerName,
        action: 'impression',
        params,
      });
  }

  private getCustomEvent(loggerName: string) {
    return (logName: string, eventType: string, params: LoggerEventParams = {}) =>
      this.track(logName, {
        view: loggerName,
        action: eventType,
        params,
      });
  }

  public getPageLogger(loggerName: string) {
    return {
      view: this.getView(loggerName),
      click: this.getClick(loggerName),
      impression: this.getImpression(loggerName),
      event: this.getCustomEvent(loggerName),
    };
  }
}

const instance = new Logger();
export default instance;

export { FirebaseConfig } from './firebase/models';
