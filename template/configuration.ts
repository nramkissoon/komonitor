/* 
  Configuration file for entire app. User should define their configuration preferences for each of the 
  listed configuration objects. See Configuration in docs for more detailed information.
*/

import { Metrics } from "./src/serverSideLogging/metrics/metrics";
import * as loggers from "./src/serverSideLogging/logger";

export const ServerSideLoggingConfiguration = {
  metrics: new Metrics([]), // fill in Loggers array with desired Logger classes from ./src/serverSideLogging/logger
};

export const SecretsConfiguration = {};

export const AuthenticationConfiguration = {};
