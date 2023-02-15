import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as screen from '../screen'
import { useEffect, useState } from 'react';
import {Waiting} from '../components';
import * as wallet from '../wallet';


const Stack = createNativeStackNavigator();

export default function SettingNavigator() {
  const [isLoading,setIsLoading] = useState(true);
  const [routeName,setRouteName] = useState('AuthenticationScreen');
  
  useEffect(() => {
      const asyncRun = async () => {
          //await wallet.removeAccounts();
          //await wallet.removeWallet();
          const _wallet = await wallet.getWallet();
          if(!_wallet.seed) setRouteName('SetAuthenticationScreen'); 
          setIsLoading(false)
      }     
      asyncRun();

  }, []);

  return (   
      isLoading
      ?
        <Waiting/>
      :  
      <Stack.Navigator screenOptions={{ headerShown: false }}
        initialRouteName= {routeName}
      >
        <Stack.Screen
          name="AuthenticationScreen"
          component={screen.AuthenticationScreen}
          options={{
            title: 'AuthenticationScreen',
          }}
        />

        <Stack.Screen
          name="SetAuthenticationScreen"
          component={screen.SetAuthenticationScreen}
          options={{
            title: 'SetAuthenticationScreen',
          }}
        />

        <Stack.Screen
          name="SetSeedScreen"
          component={screen.SetSeedScreen}
          options={{
            title: 'Awesome app',
          }}
        />
        <Stack.Screen
          name="RecoverScreen"
          component={screen.RecoverScreen}
          options={{
            title: 'RecoverScreen',
          }}
        />
        <Stack.Screen
          name="AutoSeedScereen"
          component={screen.AutoSeedScereen}
          options={{
            title: 'AutoSeedScereen',

          }}
        />
        {/*
        <Stack.Screen
          name="SetWalletScreen"
          component={screen.SetWalletScreen}
          options={{
            title: 'SetWalletScreen',
          }}
        />
        
        <Stack.Screen
          name="Test"
          component={screen.Test}
          options={{
            title: 'Test',
          }}
        />
        */}
      </Stack.Navigator>
  );
}