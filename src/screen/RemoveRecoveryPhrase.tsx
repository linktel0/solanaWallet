import {  Header } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text, TouchableOpacity, ScrollView} from "react-native";
import { Avatar,Button } from "react-native-paper";
import { useAccounts } from "../context";
import * as wallet from "../wallet";
import { useEffect, useState } from "react";
import Waiting from '../components/Waiting';
import {getExchangeCancelList,IExdata,ExchangeCancel} from "../safe_exchange/index"

type RootStackParamList = {
  RemoveRecoveryPhrase:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'RemoveRecoveryPhrase'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const RemoveRecoveryPhrase = ({ navigation }: Props) =>{
    const {accounts,setAccounts} = useAccounts();
    
    const removeWallet = () => {
      wallet.removeAccounts();
      wallet.setAccounts([]);
      wallet.removeWallet();
      setAccounts([]);
    }

    return (
      <>
      <Header goBack={() => navigation.navigate('DashboardScreen')} title={'Remove Phrase'}/>
      <View className={`w-full h-full items-center  bg-indigo-300 dark:bg-slate-800`}>
        <TouchableOpacity
          className={`mb-2 bg-indigo-500 w-5/6 h-12 justify-center items-center dark:bg-slate-600 rounded-full`}
          onPress={()=>{console.log('hello');removeWallet() }}
        >
          <Text>Remove Recovery Phrase</Text>
        </TouchableOpacity>
      </View>
      </>
    )
}