import {  Header } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text, TouchableOpacity, ScrollView} from "react-native";
import { Avatar,Button } from "react-native-paper";
import { useAccounts } from "../context";
import * as utils from '../utils';
import * as wallet from "../wallet";
import { useEffect, useState } from "react";
import Waiting from '../components/Waiting';
import { getTransferComfirmlList,IExdata,ExchangeComfirm } from "../safe_exchange";

type RootStackParamList = {
  SafeExchangeComfirm:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SafeExchangeComfirm'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const SafeExchangeComfirm = ({ navigation }: Props) =>{
  const {tokenMap,cluster,account,update,setUpdate} = useAccounts();
  const [isLoading,setIsLoading] = useState(false);
  const [items,setItems] = useState<IExdata[]>([]);
  const [showIdx,setShowIdx] = useState(-1);
  const [infoA,setInfoA] = useState<wallet.ITokenInfo | undefined>();
  const [infoB,setInfoB] = useState<wallet.ITokenInfo | undefined>();

  useEffect(()=>{
    const asyncRun = async() =>{
      setIsLoading(true);
      const keyPair = await wallet.getKeyPair(account);
      if (keyPair!=null)
        setItems(await getTransferComfirmlList(cluster,keyPair));
      setIsLoading(false);
    }
    asyncRun();
  },[])

  const setTokenInfo = async(item:IExdata,index:number) =>{
    if (showIdx!=index){
      setInfoA(tokenMap.get(item.initializerMint.toString()));
      setInfoB(tokenMap.get(item.takerMint.toString()));
      setShowIdx(index);
    }
    else {
      setShowIdx(-1);
    }
  }

  const exchange_accept = async (exdata:IExdata) =>{
    setIsLoading(true);
    const taker = await wallet.getKeyPair(account);
    if (taker!=null) {
      await ExchangeComfirm(
        cluster,
        taker,
        exdata,
      )
      var start = new Date().getTime();
      while (new Date().getTime() < start + 50);
      setShowIdx(-1);
      setItems(await getTransferComfirmlList(cluster,taker));
    }
    setIsLoading(false);
  }

  let bak = '';
  let visible = true;
  const currentLocalDate = new Date();
  const offset = currentLocalDate.getTimezoneOffset() * 60000;
  let now = Date.now();

  return(
    <>
    <Header goBack={() => navigation.navigate('SafeExchange')} title={'Comfirm Exchange'}/>
    
    <View className={`flex-1 w-full items-center bg-indigo-300 dark:bg-slate-800`}>
      {isLoading
        ?<Waiting/>
        :<ScrollView className='w-5/6'>
            {items.map((item,index)=>{
              let text = '';
              let diff = Math.floor((now-offset)/86400000)-Math.floor((Number(item.exchangeIdx)-offset)/86400000);
              console.log(diff);
              if(diff==0){
                text = 'Today';
              }
              else if (diff==1){
                text = 'Yesterday';
              }
              else if(diff>1){ 
                text = new Date((Number(item.exchangeIdx)-offset)).toDateString().slice(4);
              }

              visible = (bak!=text);
              bak = text;

              return (
                <View key={index}>
                  {visible && <View className={ index === 0 ? 'mt-[10px]' : ''}>
                    <Text className=" text-slate-900 dark:text-slate-300 text-xs font-bold">{text}</Text>
                    </View>
                  }
                <TouchableOpacity  
                  onPress = {()=>{setTokenInfo(item,index)}}
                  className={`mb-2 bg-indigo-500 h-10 justify-center dark:bg-slate-600 rounded-full`}
                >
                  <Text className={`ml-6 text-slate-900 dark:text-slate-300`}>
                    {item.escrowKey.toString().slice(0,10)}
                  </Text>
                </TouchableOpacity>
                {(showIdx==index) && 
                <TouchableOpacity className="items-center mb-2"
                  onPress={()=>{exchange_accept(item)}}
                  >
                  <View className="flex-row w-5/6 h-8 mb-1 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{item.initializer.toString().slice(0,10)+'...'}</Text>
                  </View>
                  <View className="flex-row w-4/6 h-8 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                    <Avatar.Image className='-ml-3'
                    size={32} source={{uri: infoA?.logo}} />
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{infoA?.decimals?Number(item.initializerAmount/Math.pow(10,infoA?.decimals)):''}</Text>
                    <View>
                      <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-bold ">
                        {infoA?.symbol}</Text>
                    </View>
                  </View> 
                  <Text className="text-bold -my-2 text-lg"> &#8693;</Text>
                  <View className="flex-row w-4/6 h-8 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mb-1">
                    <Avatar.Image className='-ml-3'
                    size={32} source={{uri: infoB?.logo}} />
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{infoB?.decimals?Number(item.takerAmount/Math.pow(10,infoB?.decimals)):''}</Text>
                    <View>
                      <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-bold ">
                        {infoB?.symbol}</Text>
                    </View>
                </View> 
                 <View className="flex-row w-5/6 h-8 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{item.taker.toString().slice(0,10)+'...'}</Text>
                  </View>
                </TouchableOpacity>
                }
                </View>
              );
            })}
        </ScrollView>
      }
      </View>
    </>
  )
}


