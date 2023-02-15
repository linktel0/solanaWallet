import {  Header } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text, TouchableOpacity, ScrollView} from "react-native";
import { Avatar,Button } from "react-native-paper";
import { useAccounts } from "../context";
import * as wallet from "../wallet";
import { useEffect, useState } from "react";
import Waiting from '../components/Waiting';
import { getTransferComfirmList,ITransferDate,TransferComfirm } from "../safe_transfer";

type RootStackParamList = {
  SafeTransferComfirm:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SafeTransferComfirm'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const SafeTransferComfirm = ({ navigation }: Props) =>{
  const {tokenMap,cluster,account,update,setUpdate} = useAccounts();
  const [isLoading,setIsLoading] = useState(false);
  const [items,setItems] = useState<ITransferDate[]>([]);
  const [showIdx,setShowIdx] = useState(-1);
  const [info,setInfo] = useState<wallet.ITokenInfo | undefined>();

  useEffect(()=>{
    const asyncRun = async() =>{
      setIsLoading(true);
      const keyPair = await wallet.getKeyPair(account);
      if (keyPair!=null)
        setItems(await getTransferComfirmList(cluster,keyPair));
      setIsLoading(false);
    }
    asyncRun();
  },[])

  const setTokenInfo = async(item:ITransferDate,index:number) =>{
    if (showIdx!=index){
      setInfo(tokenMap.get(item.mint.toString()));
      setShowIdx(index);
    }
    else {
      setShowIdx(-1);
    }
  }

  const transfer_comfirm = async (exdata:ITransferDate) =>{
    setIsLoading(true);
    const taker = await wallet.getKeyPair(account);
    if (taker!=null) {
      await TransferComfirm(
        cluster,
        taker,
        exdata,
      )
      var start = new Date().getTime();
      while (new Date().getTime() < start + 50);
      setShowIdx(-1);
      setItems(await getTransferComfirmList(cluster,taker));
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
    <Header goBack={() => navigation.navigate('SafeTransfer')} title={'Transfer Comfirm'}/>
    
    <View className={`flex-1 w-full items-center bg-indigo-300 dark:bg-slate-800`}>
      {isLoading
        ?<Waiting/>
        :<ScrollView className='w-5/6'>
            {items.map((item,index)=>{
              let text = '';
              let diff = Math.floor((now-offset)/86400000)-Math.floor((Number(item.transferIdx)-offset)/86400000);
              console.log(diff);
              if(diff==0){
                text = 'Today';
              }
              else if (diff==1){
                text = 'Yesterday';
              }
              else if(diff>1){ 
                text = new Date((Number(item.transferIdx)-offset)).toDateString().slice(4);
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
                  className={`mb-2 h-10 bg-indigo-500 justify-center dark:bg-slate-600 rounded-full`}
                >
                  <Text className={`ml-5 text-slate-900 dark:text-slate-300`}>
                    {item.escrowKey.toString().slice(0,10)}
                  </Text>
                </TouchableOpacity>
                {(showIdx==index) && 
                <TouchableOpacity className="items-center mb-2"
                  onPress={()=>{transfer_comfirm(item)}}
                  >
                 <View className="flex-row w-5/6 h-8 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{'From:  '+item.sender.toString().slice(0,10)+'...'}</Text>
                  </View>
                  <View className="flex-row w-4/6 h-8 my-1 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                    <Avatar.Image className='-ml-3'
                    size={32} source={{uri: info?.logo}} />
                    <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                    >{info?.decimals?Number(item.amount/Math.pow(10,info?.decimals)):''}</Text>
                    <View>
                      <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-bold ">
                        {info?.symbol}</Text>
                    </View>
                  </View>
                  <View className="flex-row w-5/6 h-8 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3">
                  <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-bold"
                  >{'To:        '+item.receiver.toString().slice(0,10)+'...'}</Text>
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


