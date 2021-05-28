import firebase, { initializeFirebase } from './firebase';
import { LoggerEnvMode, LoggerEventParams, LoggerInitializeConfig, LoggerParams } from './models';
import { initializeAmplitude, getAmplitudeClient } from './amplitude';

let mode: LoggerEnvMode = 'production';

function init(config: LoggerInitializeConfig) {
  mode = config.mode;
  if (config.services.firebase != null) {
    initializeFirebase(config.services.firebase);
  }
  if (config.services.amplitude) {
    initializeAmplitude(config.services.amplitude);
  }
}

const track = async (logName: string, { view, action, params }: LoggerParams) => {
  if (mode === 'development') {
    console.table({
      view,
      logName,
      action,
      ...params,
    });
  }

  firebase.analytics().logEvent(logName, {
    view,
    action,
    ...params,
  });

  try {
    const amplitude = await getAmplitudeClient();
    amplitude?.logEvent(logName, {
      view,
      action,
      ...params,
    });
  } catch (e) {
    return;
  }
};

const getView = (logger: string) => () =>
  track(`${logger}_view`, {
    view: logger,
    action: 'view',
  });

const getClick =
  (logger: string) =>
  (logName: string, params: LoggerEventParams = {}) =>
    track(logName, {
      view: logger,
      action: 'click',
      params,
    });

const getImpression =
  (logger: string) =>
  (logName: string, params: LoggerEventParams = {}) =>
    track(logName, {
      view: logger,
      action: 'impression',
      params,
    });

const getCustomEvent =
  (logger: string) =>
  (logName: string, eventType: string, params: LoggerEventParams = {}) =>
    track(logName, {
      view: logger,
      action: eventType,
      params,
    });

export interface Logger {
  view: ReturnType<typeof getView>;
  click: ReturnType<typeof getClick>;
  impression: ReturnType<typeof getImpression>;
  event: ReturnType<typeof getCustomEvent>;
}

const generateLogger = (logger: string): Logger => {
  return {
    view: getView(logger),
    click: getClick(logger),
    impression: getImpression(logger),
    event: getCustomEvent(logger),
  };
};

export default {
  init,
  generateLogger,
};
