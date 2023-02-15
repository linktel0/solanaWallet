import { StatusBar } from 'expo-status-bar';
import { LogBox} from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContextProvider } from './src/context';
import Navigator from './src/navigation';
const TextEncodingPolyfill = require('text-encoding');

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});


import "./global";
import "react-native-url-polyfill/auto";
import "nativewind/types.d";


LogBox.ignoreAllLogs(true)

export default function App() {
  return (
    <SafeAreaProvider>
      <ContextProvider>
        <PaperProvider>
          <Navigator/>
          <StatusBar/>
        </PaperProvider>
      </ContextProvider>
    </SafeAreaProvider>
  );
}

/*"androidNavigationBar": {
        "visible": "immersive"
    },
*/