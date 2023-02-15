import {  Header } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text} from "react-native";
import { Avatar,Button } from "react-native-paper";

type RootStackParamList = {
  SafeExchange:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SafeExchange'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const SafeExchange = ({ navigation }: Props) =>{

  return(
    <>
    <Header goBack={() => navigation.navigate('DashboardScreen')} title={'SaveExchange'}/>
    <View className={`flex-1 w-full items-center bg-indigo-300 dark:bg-slate-800`}>
        <View className={'my-20'}>
          <Avatar.Image size={240} source={require("../../assets/images/panda.png")} />
        </View>  

        <Button className={`bg-indigo-400 w-72 android:mt-5 dark:bg-slate-700 rounded-full`}
            mode="contained" onPress={() => navigation.navigate('SafeExchangeCreate')}>
            <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Create exchange</Text>
        </Button>

        <Button className={`bg-indigo-400 w-72 dark:bg-slate-700 mt-5 rounded-full`}
            mode="contained" onPress={() => navigation.navigate('SafeExchangeCancel')}>
            <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Cancel exchange</Text>
        </Button>  

        <Button className={`bg-indigo-400 w-72 dark:bg-slate-700 mt-5 rounded-full`}
            mode="contained" onPress={() => navigation.navigate('SafeExchangeComfirm')}>
            <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Comfirm Exchange</Text>
        </Button>
      </View>
    </>
  )
}


