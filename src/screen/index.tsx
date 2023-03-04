import { View,Text } from 'react-native'
import { Avatar } from 'react-native-paper'

export {SetAuthenticationScreen} from './SetAuthenticationScreen'
export {SetSeedScreen} from './SetSeedScreen'
export {AutoSeedScereen} from './AutoSeedScereen'
export {RecoverScreen} from './RecoverScreen'
export {AuthenticationScreen} from './AuthenticationScreen'
export {DrawerContent} from './DrawerContent'
export {DashboardScreen} from './DashboardScreen'
//export {Collections} from './Collections'
export {SetCluster} from './SetCluster'
export {SettingScreen} from './SettingScreen'
export {DepositScreen} from './DepositScreen'
export {BuyScreen} from './BuyScreen'
export {SendScreen} from './SendScreen'
export {AirdropSol} from './AirdropSol'
export {MintScreen} from './MintScreen'
export {AirdropToken} from './AirdropToken'
export {SafeTransfer} from './SafeTransfer'
export {SafeTransferCreate} from './SafeTransferCreate'
export {SafeTransferCancel} from './SafeTransferCancel'
export {SafeTransferConfirm} from './SafeTransferConfirm'
export {SafeExchange} from './SafeExchange'
export {SafeExchangeCancel} from './SafeExchangeCancel'
export {SafeExchangeCreate} from './SafeExchangeCreate'
export {SafeExchangeConfirm} from './SafeExchangeConfirm'
export {RemoveRecoveryPhrase} from './RemoveRecoveryPhrase'
export {History} from './History'

export function FirstScreen() {
      
      return (
        <View className={`h-10 flex-1 items-center justify-center`}>
            <Text>FirstScreen</Text>
        </View>
      );
  }

  export function HomeScreen() {
      
    return (
      <View className={`h-10 flex-1 items-center justify-center`}>
          <Text>HomeScreen</Text>
      </View>
    );
}

export function TestScreen() {
      
  return (
    <View className='h-full items-center bg-indigo-400'>
      <View className='mt-48 justify-center'>
        <Avatar.Image size={240} source={require("../assets/panda.png")} />
      </View> 
      <Text className='text-2xl font-bold mt-32'>Sonala wallet</Text>
      <Text className='text-xl mt-3'>for web3 developer</Text>
    </View>
  );
}


