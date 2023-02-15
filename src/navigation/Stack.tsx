import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './Tab'
import * as screen from '../screen'
import { IToken } from '../wallet';

type RootStackParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  SetCluster: undefined;
  TabNavigator: undefined;
  DepositScreen: {action:string,symbol:string} ;
  BuyScreen: {action:string,token:IToken} ;
  SendScreen: {action:string,token:IToken} ;
  MintScreen: undefined ;
  AirdropSol: undefined ;
  AirdropToken: undefined ;
  SmartContract: undefined ;
  SafeExchange: undefined ;
  SafeExchangeCreate: undefined ;
  SafeExchangeCancel: undefined ;
  SafeExchangeComfirm: undefined ;
  SafeTransfer:  undefined ;
  SafeTransferCreate:undefined ;
  SafeTransferCancel:undefined ;
  SafeTransferComfirm:undefined ;
  RemoveRecoveryPhrase:undefined ;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TabNavigator"
    >
      <Stack.Screen
        name="HomeScreen"
        component={screen.HomeScreen}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={screen.SettingScreen}
        options={{
          title: 'Setting',
        }}
      />
      <Stack.Screen
        name="SetCluster"
        component={screen.SetCluster}
        options={{
          title: 'SetCluster',
        }}
      />

      <Stack.Screen
        name="DepositScreen"
        component={screen.DepositScreen}
        options={{
            title: 'DepositScreen',
        }}
      />

      <Stack.Screen
        name="BuyScreen"
        component={screen.BuyScreen}
        options={{
            title: 'BuyScreen',
        }}
      />    
      <Stack.Screen
        name="SendScreen"
        component={screen.SendScreen}
        options={{
            title: 'SendScreen',
        }}
      />
      <Stack.Screen
        name="AirdropSol"
        component={screen.AirdropSol}
        options={{
            title: 'AirdropSol',
        }}
      />

      <Stack.Screen
        name="AirdropToken"
        component={screen.AirdropToken}
        options={{
            title: 'AirdropToken',
        }}
      />

      <Stack.Screen
        name="SafeExchange"
        component={screen.SafeExchange}
        options={{
            title: 'SafeExchange',
        }}
      />

      <Stack.Screen
        name="SafeExchangeCreate"
        component={screen.SafeExchangeCreate}
        options={{
            title: 'SafeExchangeCreate',
        }}
      />

      <Stack.Screen
        name="SafeExchangeCancel"
        component={screen.SafeExchangeCancel}
        options={{
            title: 'SafeExchangeCancel',
        }}
      />

      <Stack.Screen
        name="SafeExchangeComfirm"
        component={screen.SafeExchangeComfirm}
        options={{
            title: 'SafeExchangeComfirm',
        }}
      />

      <Stack.Screen
        name="SafeTransfer"
        component={screen.SafeTransfer}
        options={{
            title: 'SafeTransfer',
        }}
      />

      <Stack.Screen
        name="SafeTransferCreate"
        component={screen.SafeTransferCreate}
        options={{
            title: 'SafeTransferCreate',
        }}
      />

      <Stack.Screen
        name="SafeTransferCancel"
        component={screen.SafeTransferCancel}
        options={{
            title: 'SafeTransferCancel',
        }}
      />

      <Stack.Screen
        name="SafeTransferComfirm"
        component={screen.SafeTransferComfirm}
        options={{
            title: 'SafeTransferComfirm',
        }}
      />

      <Stack.Screen
        name="RemoveRecoveryPhrase"
        component={screen.RemoveRecoveryPhrase}
        options={{
            title: 'RemoveRecoveryPhrase',
        }}
      />

      <Stack.Screen
        name="MintScreen"
        component={screen.MintScreen}
        options={{
            title: 'MintScreen',
        }}
      />
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
            title: 'Tab navigation',
        }}
      />
     
    </Stack.Navigator>
  );
}