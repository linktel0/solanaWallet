// Inject node globals into React Native global scope.
//import { randomBytes } from 'react-native-randombytes'
//global.randomBytes = require("react-native-randombytes.js");

global.BigInt = require("bignumber.js");

global.Buffer = require("buffer").Buffer;
global.Buffer.TYPED_ARRAY_SUPPORT = false;

global.process = require("process");
global.process.env.NODE_ENV = __DEV__ ? "development" : "production";

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: "file:",
};
