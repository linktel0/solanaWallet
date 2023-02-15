import {  Header } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text} from "react-native";
import { Avatar,Button } from "react-native-paper";

type RootStackParamList = {
    AcceptExchange:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AcceptExchange'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const AcceptExchange = ({ navigation }: Props) =>{

  return(
    <>
    <Header goBack={() => navigation.navigate('SafeExchange')} title={'AcceptExchange'}/>
    <View className={`flex-1 w-full items-center bg-indigo-300 dark:bg-slate-800`}>
        
    </View>
    </>
  )
}


