import React, { useEffect,  useState } from "react";
import {View,Text,TouchableOpacity,ScrollView } from 'react-native'
import { Avatar } from "react-native-paper";
import {useNavigation,DrawerActions, RouteProp,useIsFocused}  from "@react-navigation/native";
import { getHistory, ITransaction, urlMap } from '../utils'
import { useAccounts } from "../context";
import * as wallet from '../wallet'
import { StackNavigationProp } from "@react-navigation/stack";
import Header1 from "../components/Header1";
import * as Linking from 'expo-linking';
import { Waiting } from "../components";

type RootStackParamList = {
  History: {itemId:Number} ;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'History'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'History'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export const History = ({ route,navigation }: Props) => {
  const [history,setHistory] = useState<ITransaction[]>([]);
  const [now,setNow] = useState<number>(0);
  const [isLoading,setIsLoading] = useState(false);
  
  const {update,tokenMap,cluster,account,explorer} = useAccounts();
  const navigator = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    const publicKey = account.tokens.master.publicKey
    setIsLoading(true);
    async function getAsync(){
      if (publicKey) {
        setHistory(await getHistory(cluster,publicKey));
        setNow((Date.now()/1000));
        setIsLoading(false);
      }
    };
    getAsync();
  }, [account,cluster,update,isFocused]);
    
  let bak = '';
  let visible = true;

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
      history &&
      <View className='ml-7'>
        <ScrollView>
        {history.map((transaction,index)=>{
          //console.log(transaction)
          //console.log(index)
          const owner = account.tokens.master.publicKey;
          let text = '';
          let diff = Math.floor(now/86400)-Math.floor(transaction.date/86400);

          let fee = 0;
          let amount = -1
          let fromAddress:string|undefined;
          let toAddress:string|undefined
          let act = 'Received';
          let mint:string|undefined = '';

          if(diff==0){
            text = 'Today';
          }
          else if (diff==1){
            text = 'Yesterday';
          }
          else if(diff>1){
            text = new Date(1000*transaction.date).toDateString().slice(4);
            text = text 
          }
          visible = (bak!=text);
          bak = text;

          let url = urlMap.get(explorer)+transaction.signature+'?cluster='+cluster;
          if (explorer.toString()=='SolanaFM'){
            url +='-solana';
          }
          //console.log(url,explorer.toString());
          
          if(transaction.balances.length==1){
            for (const balance of transaction.balances){
              fee = -0.000005
              const value = (balance.postBalance-balance.preBalance)/Math.pow(10, balance.decimals);
              amount = value - fee;
              act = 'App';
              fromAddress = 'Success';
              mint = balance.mint
            }
          }
          if(transaction.balances.length==2){
            for (const balance of transaction.balances){
              if (mint?.length==0){
                mint = balance.mint;
              }
              const value = (balance.postBalance-balance.preBalance)/Math.pow(10, balance.decimals);
              if (value > 0) {
                amount = value;
                toAddress = 'To: ' +balance.address?.slice(0,6)+'...';
                if (balance.address == owner){
                  act = 'Received';
                  mint = balance.mint
                }
              }
              if (value < 0){
                fee = -0.000005
                amount = value - fee;
                fromAddress = 'From: ' + balance.address?.slice(0,6)+'...';
                if(balance.address == '4ETf86tK7b4W72f27kNLJLgRWi9UfJjgH4koHGUXMFtn'){
                  fromAddress = 'From: Airdrop';
                }
                if(balance.address == '9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g'){
                  fromAddress = 'From: Airdrop';
                }
                
                if (balance.address == owner){
                  act = 'Send';
                  mint = balance.mint
                  fromAddress = 'From: Airdrop';
                }
              }
            }
          }

          if(transaction.balances.length==3){
            for (const balance of transaction.balances){
              //console.log(balance);
              const value = (balance.postBalance-balance.preBalance)/Math.pow(10, balance.decimals);
              if (value > 0) {
                amount = value;
                toAddress = 'To: ' +balance.address?.slice(0,6)+'...';
                if (balance.address == owner){
                  act = 'Received';
                  mint = balance.mint
                }
              }
              if (value < 0){
                fee = -0.000005
                amount = value
                if(balance.mint == 'So11111111111111111111111111111111111111112'){
                  amount = value - fee;
                }
                fromAddress = 'From: ' + balance.address?.slice(0,6)+'...';
                if (balance.address == owner){
                  act = 'Send';
                  mint = balance.mint
                  fromAddress = 'From: Airdrop';
                }
              }
            }
          }

          let info:wallet.ITokenInfo|undefined;
          if (mint!=undefined){
            info = tokenMap.get(mint);
          }
          //console.log(amount,transaction);
          return (
            <View key={index}>
            {visible && <View className={ index === 0 ? 'mt-[10px]' : ''}>
              <Text className=" text-slate-900 dark:text-slate-300 text-xs font-bold">{text}</Text>
            </View>
            
            }
            <TouchableOpacity 
              onPress={()=>{Linking.openURL(url);}}
              className={`flex-row mb-2 justify-between items-center w-11/12 bg-indigo-400 dark:bg-slate-600 rounded-full`}>
                <View className={'flex-row'}>
                  <Avatar.Image size={56} source={{uri: info?.logo}} />
                  <View className={`mx-3`}>
                    <Text className={` text-slate-900 dark:text-slate-300  font-bold`}>{act}</Text>
                    <Text className={` text-slate-900 dark:text-slate-300 text-xs`}>
                      {(act=='Send'?toAddress:fromAddress)}</Text>   
                  </View>
                </View>
                <View className={`mr-5 items-end`}>
                  <Text className={` text-slate-900 dark:text-slate-300  font-bold`}>{(act=='Send'?-1:1)*Math.abs(amount)}</Text>
                    {/*<Text className={` text-slate-900 dark:text-slate-300  `}>  {info?.symbol}</Text>*/}
                  <Text className={` text-slate-900 dark:text-slate-300  `}>({info?.symbol/*(act=='Send'|| act=='App')?fee:''*/})</Text>
                </View>
            </TouchableOpacity>
            </View>
            )
        })}
        <Text/>
        <Text/>
        <Text/>
        <Text/>
        </ScrollView>
      </View>
      }
    </View>
  );
}
