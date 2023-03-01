import {  Header } from "../components";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text,TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useAccounts } from "../context";
import QRCode from "react-native-qrcode-svg";
import {useColorScheme } from "nativewind";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { IToken } from "../wallet";

type RootStackParamList = {
  DepositScreen: {action:string,token:IToken} ;
  };
  
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'DepositScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'DepositScreen'
  >;
  
type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
 };
  

export const DepositScreen = ({ route, navigation }: Props) =>{
  const {tokenMap,cluster,account} = useAccounts();
  const [hasCopyed,setHasCopyed] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  useEffect(()=>{
    const asyncRun = () => {
      setTimeout(() => {
        setHasCopyed(false)
      }, 2000);
    }
    if (hasCopyed) asyncRun()
  },[hasCopyed])

  const copyToClipboard = async (mnemonic:string) => {
    await Clipboard.setString(mnemonic);
    setHasCopyed(true)
  };

  const info = tokenMap.get(route.params.token.mintKey);
  return(
    <>
    <Header goBack={() => navigation.navigate('DashboardScreen')} title={'Deposit (' + info?.symbol+')'}/>
    <View className={`w-full h-full  items-center  bg-indigo-300 dark:bg-slate-800`}>
      <View className=" border-slate-300 border-8 mt-32">
        <QRCode size={200}
          value={account.tokens.master.publicKey}
        /> 
      </View>
      
      <TouchableOpacity className={`mt-20 w-72 h-12 flex-row justify-between items-center bg-indigo-500 dark:bg-slate-600 rounded-full`} 
        onPress={() => copyToClipboard(account.tokens.master.publicKey)}>
          <Text className=" text-slate-900 dark:text-slate-300 font-bold ml-6">
            { account.tokens.master.publicKey.slice(0,6)+'...'}
          </Text>
          <Button className={` bg-indigo-500 dark:bg-slate-600`}
            icon="clipboard-check-multiple-outline"
            mode="contained" onPress={() => copyToClipboard(account.tokens.master.publicKey)}>
            <Text className=" text-slate-900 dark:text-slate-300 font-bold ml-6">
            {hasCopyed ? 'Copyed' : 'Copy'}
          </Text>
        </Button>
      </TouchableOpacity>
    </View>
    </>
  )
}