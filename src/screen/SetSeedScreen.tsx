import { RouteProp } from '@react-navigation/native';
import {View,Text} from 'react-native'
import { Button,Avatar} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import {Header} from "../components";


type RootStackParamList = {
    SetSeedScreen: undefined;
  };
  
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'SetSeedScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SetSeedScreen'
  >;
  
type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
 };
  
export const SetSeedScreen = ({ route, navigation }: Props) => {
    return (
      <>
      <Header goBack={() => navigation.navigate('SetAuthenticationScreen')} />
      <View className={`flex-1 w-full items-center bg-indigo-300 dark:bg-slate-800`}>
        <View className={'my-20'}>
          <Avatar.Image size={240} source={require("../../assets/images/panda.png")} />
        </View>  

        <Button className={`bg-indigo-400 w-72 android:mt-10 dark:bg-slate-700 rounded-full`}
            mode="contained" onPress={() => navigation.navigate('AutoSeedScereen')}>
            <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Create Wallet</Text>
        </Button>

        <Button className={`bg-indigo-400 w-72 dark:bg-slate-700 mt-10 rounded-full`}
            mode="contained" onPress={() => navigation.navigate('RecoverScreen')}>
            <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Recovery Wallet</Text>
        </Button>  
      </View>
      </>
    );
  }


