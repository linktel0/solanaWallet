import React, { useEffect, useState } from "react";
import { View ,Text,TouchableOpacity} from "react-native";
import {  Header1 } from "../components";
import { Avatar, Button } from "react-native-paper";
import {useNavigation,DrawerActions}  from "@react-navigation/native";
import * as  utils from "../utils";
import { useAccounts } from "../context";
import Waiting from '../components/Waiting';
import * as wallet from "../wallet";
import { StackNavigationProp } from "@react-navigation/stack";
import {useColorScheme } from "nativewind";



type RootStackParamList = {
  DashboardScreen: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DashboardScreen'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export const DashboardScreen = ({ navigation }: Props) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isLoading,setIsLoading] = useState(false);
  const {tokenMap,setTokenMap,update,cluster,setCluster,setExplorer,account, setAccount ,accounts} = useAccounts();
  const [balance, setBalance] = useState<Map<string,number>>();
  const [tokens,setTokens] = useState<wallet.IToken[]>([]);
  const [action,setAction] = useState('Deposit');
  const navigator = useNavigation();


  //setVisible(true);
  useEffect(()=>{
    const asyncRun = async() =>{
      setIsLoading(true);
      //console.log(accounts);
      if (colorScheme != await wallet.getTheme()) toggleColorScheme();
      setCluster(await wallet.getCluster());
      setExplorer(await wallet.getExplorer());
      setAccount(await wallet.getDefaultAccount(accounts));
      setTokenMap(await wallet.getTokenMap());
      setIsLoading(false);
    }
    asyncRun();
  },[])

  useEffect(()=>{
     const AsyncgetBalance = async() => {
        await getBalance();   
     }
     AsyncgetBalance();
  },[update,account,cluster])  

  
  const getBalance = async () =>{
    if(!account.tokens.master.publicKey) return;
    setIsLoading(true);
    const _balance = new Map();
    let pubkey = account.tokens.master.publicKey;
    let bal = await utils.getBalance(cluster,pubkey);
    _balance.set(pubkey,Math.round(bal*100)/100);
    const tokens = wallet.getTokens(cluster,account);      
    for(let i=0;i<tokens.length;i++){
      pubkey = tokens[i].publicKey
      bal = await utils.getTokenBalance(cluster,pubkey)
      _balance.set(pubkey,Math.round(bal*100)/100);
    }
    setTokens(tokens);
    setBalance(_balance);
    setIsLoading(false); 
  }
  
  const _info = tokenMap.get(account.tokens.master.mintKey);

  return (
    <View className={` bg-indigo-300 dark:bg-slate-800 w-full h-full`}>
      <Header1 account={account} cluster={cluster}
        goTo={()=>{navigation.navigate('FirstScreen')}}
        goTo1={()=>{navigation.navigate('SetCluster')}}
        goBack={()=>{navigator.dispatch(DrawerActions.toggleDrawer())}}/>

        {isLoading 
         ?
          <Waiting/>
        :
        <View className={`items-center`}>
          <View className={`flex-row mt-16`}>
            <Button className={`w-24 h-12  
              ${(action==='Deposit')? ` bg-indigo-500 dark:bg-slate-500 `
              :`bg-indigo-400 dark:bg-slate-700 `}`}
              onPress={() => {setAction('Deposit')}}>
              <Text className={` text-slate-900 dark:text-slate-300`}>
              Diposit</Text>
            </Button> 
            <Button className={`w-24 h-12 mx-2
              ${(action==='Buy')? ` bg-indigo-500 dark:bg-slate-500 `
              :`bg-indigo-400 dark:bg-slate-700 `}`}
              onPress={() => {setAction('Buy');getBalance()}}>
              <Text className={` text-slate-900 dark:text-slate-300`}            
              >Buy</Text>
            </Button> 
            <Button className={`w-24 h-12 
              ${(action==='Send')? ` bg-indigo-500 dark:bg-slate-500 `
              :`bg-indigo-400 dark:bg-slate-700 `}`}
              onPress={() =>{setAction('Send')}}>
              <Text className={` text-slate-900 dark:text-slate-300`}>Send</Text>
            </Button> 
          </View>       
        
          <View className={`mt-10 flex-col w-full`}>
            { account.tokens.master.publicKey?
            <TouchableOpacity 
              onPress={()=>{navigation.navigate(action+'Screen',{action:action,token:account.tokens.master})}}
              className={`flex-row mx-7 my-2 items-center bg-indigo-500 dark:bg-slate-600 rounded-full`}>
                <Avatar.Image size={64} source={{uri: _info?.logo}} />
                <View className={`flex-col justify-start mx-3`}>
                    <Text className={` text-slate-900 dark:text-slate-300 font-bold`}>{_info?.name}</Text>
                    <View className={`flex-row items-center`}>
                      <Text className={` text-slate-900 dark:text-slate-300 text-xs font-bold`}>{(balance?.get(account.tokens.master.publicKey))}</Text>
                      <Text className={` text-slate-900 dark:text-slate-300 text-xs font-bold`}> ({_info?.symbol})</Text>
                    </View> 
                </View>
            </TouchableOpacity>
            :<></>
            }
            { tokens.length?
              tokens.map((item,index)=>{
                const info = tokenMap.get(item.mintKey);
                return (
                  <TouchableOpacity key={index} 
                  onPress={()=>{navigation.navigate(action+'Screen',{action:action,token:item})}}
                  className={`flex-row mx-7 my-2 items-center  bg-indigo-500 dark:bg-slate-600 rounded-full`}>
                    <Avatar.Image size={64} source={{uri: info?.logo}} />
                    <View className={`flex-col justify-start mx-3`}>
                        <Text className={` text-slate-900 dark:text-slate-300 font-bold`}>{info?.name}</Text>
                        <View className={`flex-row items-center`}>
                          <Text className={` text-slate-900 dark:text-slate-300 text-xs font-bold`}>{(balance?.get(item.publicKey))}</Text>
                          <Text className={` text-slate-900 dark:text-slate-300 text-xs font-bold`}> ({info?.symbol})</Text>
                        </View> 
                    </View>
                  </TouchableOpacity>
                )
              })
            :<></>

            }
          </View>
        </View> }
    </View>  
  );
}


