import { format } from "date-fns";

let config = {};

const LogLevel = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  FATAL: 4,
});

let currentLogLevel = LogLevel.INFO; // Default log level
let isLogOn = false;

const getIsLogOn = () => isLogOn;
const getLogLevel = () => currentLogLevel;

const getLogLevelText = levelValue => {
  return Object.keys(LogLevel).reduce((found, key) => {
    if (LogLevel[key] === levelValue) return key;
    return found;
  }, null);
};

const setLogLevel = (level = LogLevel.ERROR) => {
  currentLogLevel = level > LogLevel.ERROR ? LogLevel.ERROR : level;
  log(`logLevel changed to ${getLogLevelText(currentLogLevel)}`);
};

const setLogOn = (status = false) => {
  isLogOn = status;
  // log(`logLevel is ${isLogOn ? `enabled on ${getLogLevelText(currentLogLevel)} level` : "disabled"}`);
};

const fetchLog = async (logLevel, module, text) => {
  const logInfo = { logLevel, module, text };

  const response = await fetch(`${config.apiUrl}/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": config.apiKey,
      "X-API-DEVICE-KEY": config.apiDeviceKey,
      "X-DEVICE-ID": config.deviceId,
    },
    body: JSON.stringify(logInfo),
  });
  return response.status;
};

const log = (message, level = -1, module) => {
  // console.log(`debugging-log : ${JSON.stringify(environment)} - isLogOn:${isLogOn}, currentLogLevel:${currentLogLevel}, level:${level}, module:${module}, message:[${message}] `);

  if (!Object.keys(config).length) return; // LogService is not yet ready

  if ((isLogOn && level >= currentLogLevel) || level === -1 || level === LogLevel.FATAL) {
    if (config.environment.isExpoGo) {
      const moduleText = module ? `[${module}]` : "";
      const currentTime = format(new Date(), "HH:mm:ss");

      switch (level) {
        case LogLevel.DEBUG:
          console.info(`[${currentTime}][D]${moduleText} ${message}`);
          break;
        case LogLevel.INFO:
          console.info(`[${currentTime}][I]${moduleText} ${message}`);
          break;
        case LogLevel.WARNING:
          console.warn(`[${currentTime}][W]${moduleText} ${message}`);
          break;
        case LogLevel.FATAL:
        case LogLevel.ERROR:
          console.error(`[${currentTime}][E]${moduleText} ${message}`);
          break;
        default:
          console.log(`[${currentTime}]${moduleText} ${message}`);
          break;
      }
    }

    if (!config.environment.isExpoGo && level !== -1) {
      fetchLog(level, module, message)
        .then(_ => {})
        .catch(err => console.error(`[E][LogService] ${err.message}`));
    }
  }
};

const Log = module => ({
  console: text => log(text, -1, module),
  debug: text => log(text, LogLevel.DEBUG, module),
  info: text => log(text, LogLevel.INFO, module),
  warn: text => log(text, LogLevel.WARNING, module),
  error: text => log(text, LogLevel.ERROR, module),
  fatal: text => log(text, LogLevel.FATAL, module),
});

export const init = configService => {
  config = { ...config, apiUrl: configService.apiUrl, apiKey: configService.apiKey, environment: configService.environment, apiDeviceKey: configService.apiDeviceKey, appName: configService.appName, deviceId: configService.getDeviceId() };
};

const LogService = { Log, setLogLevel, setLogOn, getIsLogOn, getLogLevel };
export default LogService;
