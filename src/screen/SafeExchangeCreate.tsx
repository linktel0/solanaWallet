import {  Header,Waiting,NumberKeyboard } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text,TouchableOpacity, Dimensions,StyleSheet } from "react-native";
import { Avatar,Portal, Appbar } from "react-native-paper";
import { useAccounts } from "../context";
import {useColorScheme } from "nativewind";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as NavigationBar from 'expo-navigation-bar';
import * as utils from '../utils';
import * as wallet from "../wallet";
import * as Font from 'expo-font';
import {ExchangeInit} from "../safe_exchange/index"


type RootStackParamList = {
  SafeExchangeCreate:undefined ;
  };

type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SafeExchangeCreate'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const SafeExchangeCreate = ({navigation }: Props) =>{
    const {tokenMap,cluster,account,update,setUpdate} = useAccounts();
    const [visible, setVisible] = useState(false);
    const [accountB,setAccountB] = useState('');
    const {colorScheme } = useColorScheme();
    const [chip,setChip] = useState('');
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [check, setCheck] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [success,setSuccess] = useState('Create');
    const [maxValue,setMaxValue] = useState(0);
    const [isamountA,setIsamountA] = useState(true);
    const [selectA,setSelectA] = useState(false);
    const [selectB,setSelectB] = useState(false);
    const [mintA,setMintA] = useState('');
    const [mintB,setMintB] = useState('');
    const [tokens,setTokens] = useState<wallet.IToken[]>([]);
    const [map2arr,setMap2arr] = useState<string[]>([]);
   
    const _onPressNumber = (n: string) => {
      if (n=='') return
      if(isamountA){
        (n!='←')
        ?setAmountA(amountA+n)
        :setAmountA(amountA.slice(0,amountA.length-1));
      }
      else {
        (n!='←')
        ?setAmountB(amountB+n)
        :setAmountB(amountB.slice(0,amountB.length-1));
      }
    };
   
    useEffect(()=>{
      setMintA(account.tokens.master.mintKey); 
      const runAsync = async() =>{
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        await Font.loadAsync({
          'monospace': require("../assets/fonts/SpaceMono-Regular.ttf")
        });

        setMaxValue(await utils.getBalance(cluster,account.tokens.master.publicKey));
        setTokens(wallet.getTokens(cluster,account));
        setMap2arr(Array.from(tokenMap).map(([key, value]) => (key)));
      }
      runAsync();
    },[])
   
  
    useEffect(()=>{
      const asyncRun = async () => {
        setChip(await Clipboard.getStringAsync() )
      }
      asyncRun()
    },[])
  
    interface result {
      type:any,
      data:any,
    }

    const mintInfo = (mint:string) =>{
      return tokenMap.get(mint);
    }

    const setBalance = async(token:wallet.IToken) => {
      if (token.mintKey.includes('So1111111111')) {
        setMaxValue(await utils.getBalance(cluster,token.publicKey));
      }
      else {
        setMaxValue( await utils.getTokenBalance(cluster,token.publicKey));
      }
    }
  
    const handleBarCodeScanned = ({ type, data }:result) => {
      setAccountB(data);
      setVisible(false);
      NavigationBar.setVisibilityAsync("visible");
    };

    const exchange_init = async () =>{
      setIsLoading(true);
      const initializer = await wallet.getKeyPair(account);
      if (initializer!=null) {
        await ExchangeInit(
          cluster,
          initializer,
          mintA,
          amountA,
          accountB,
          mintB,
          amountB
      )}
      setIsLoading(false);
    }
  
      
    const height = Dimensions.get('window').height;
  
  return(
    <>
    <Header goBack={() => navigation.navigate('SafeExchange')} title={'CreateExchange'}/>
    <View className={`w-full h-full  items-center  bg-indigo-300 dark:bg-slate-800`}>
      {visible &&
      <Portal>
        <Appbar.Header  
          style={colorScheme==='dark'? {backgroundColor:'#1e293b'}:{backgroundColor:'#a5b4fc'} } >
          <View className="flex-row items-center  bg-indigo-300  dark:bg-slate-800">
            <TouchableOpacity onPress={()=>setVisible(false)}>
                <Avatar.Icon size={48} icon="arrow-left" className="bg-indigo-300 dark:bg-slate-800 ml-3"/>
            </TouchableOpacity>  
            <Text className=" text-slate-800 dark:text-slate-300 font-bold ml-2"
            >ScanQRCode</Text>
          </View>     
        </Appbar.Header>
        <View className="justify-center">
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={{ width: height , height: height, alignSelf: "center" }} />
        </View>
      </Portal>
       }
       {
        selectA && <Portal>
          <View className="items-center w-full h-full justify-center  bg-indigo-300 dark:bg-slate-700">
            <View className="items-center justify-center w-11/12 bg-indigo-400 dark:bg-slate-700 rounded-2xl">
              <TouchableOpacity 
                onPress={()=>{setSelectA(false);setSelectB(false);
                  setMintA(account.tokens.master.mintKey);setBalance(account.tokens.master)}}
                  className={`flex-row w-80 items-center my-5 bg-indigo-500 dark:bg-slate-600 rounded-full`}>
                  <Avatar.Image size={64} source={{uri: mintInfo(account.tokens.master.mintKey)?.logo}} />
                  <View className="ml-2">
                    <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                      className={"text-slate-900 dark:text-slate-300"}
                    >{account.tokens.master.mintKey.slice(0,21)}</Text>
                    <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                      className={"text-slate-900 dark:text-slate-300"}
                    >{account.tokens.master.mintKey.slice(21)}</Text>
                  </View>
              </TouchableOpacity>
              { tokens.map((item,index)=>{
                  const _info = tokenMap.get(item.mintKey);
                  return (
                    <TouchableOpacity key={index} 
                    onPress={()=>{setSelectA(false);setMintA(item.mintKey);setBalance(item)}}
                      className={`flex-row w-80 items-center mb-5 bg-indigo-500 dark:bg-slate-600 rounded-full`}>
                      <Avatar.Image size={64} source={{uri: _info?.logo}} />
                      <View className="ml-2">
                      <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                        className={"text-slate-900 dark:text-slate-300"}
                      >{item.mintKey.slice(0,22)}</Text>
                      <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                        className={"text-slate-900 dark:text-slate-300"}
                      >{item.mintKey.slice(22)}</Text>
                    </View>
                    </TouchableOpacity>
                  )
              })
            }
            </View>
          </View>
        </Portal>
       }
       {
        selectB && <Portal>
           <View className="items-center w-full h-full justify-center  bg-indigo-300 dark:bg-slate-700">
           <View className="items-center justify-center w-11/12 bg-indigo-400 dark:bg-slate-600 rounded-2xl">
              { map2arr.map((item,index)=>{
                  if (item === mintA) {
                    return
                  }
                  const _info = tokenMap.get(item);
                  return (
                    <TouchableOpacity key={index} 
                      onPress={()=>{setSelectB(false);setMintB(item)}}
                      className={`flex-row w-80 items-center mt-5 bg-indigo-500 dark:bg-slate-500 rounded-full`}>
                      <Avatar.Image size={64} source={{uri: _info?.logo}} />
                      <View className="ml-2">
                      <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                        className={"text-slate-900 dark:text-slate-300"}
                      >{item.slice(0,22)}</Text>
                      <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                        className={"text-slate-900 dark:text-slate-300"}
                      >{item.slice(22)}</Text>
                    </View>
                    </TouchableOpacity>
                  )
              })
            }
            <View className="w-1/2 h-5  bg-indigo-400 dark:bg-slate-600"></View>
            </View>
          </View>
        </Portal>
       }
      <Text className=" w-5/6 text-slate-900 dark:text-slate-300 ml-2 text-bold" 
        >Exchange </Text>
      <View className="flex-row w-5/6 h-14 items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-1">
        <Text className="text-bold text-slate-900 dark:text-slate-300 ml-2" 
        >From:  </Text> 
        <View >
          <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
            className={"text-slate-900 dark:text-slate-300"}
          >{account.tokens.master.publicKey.slice(0,22)}</Text>
          <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
            className={"text-slate-900 dark:text-slate-300"}
          >{account.tokens.master.publicKey.slice(22)}</Text>
        </View>
      </View>

      <View
          className='flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2'>
          
        <TouchableOpacity onPress={()=>{setSelectA(true);setSelectB(false);setIsamountA(true)}}>
          <Avatar.Image className='-ml-3'
            size={56} source={{uri: mintInfo(mintA)?.logo}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{console.log(setIsamountA(true))}}
        >
          <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold"
          >{isamountA?(amountA+'_'):amountA+'   '}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setSuccess('Send')}}>
          <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-bold ">
            {mintInfo(mintA)?.symbol}</Text>
        </TouchableOpacity>
        </View>
       
        <View className="w-56 flex-row justify-center items-center">
            {(Number(amountA)>maxValue) 
                ?<Text className='text-red-600 text-xs'>Max:  {Number(maxValue).toFixed(2)} {mintInfo(mintA)?.symbol}</Text>
                :<Text className='text-xs'></Text>
            }
        </View>
    
      <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-1">
        <View className="flex-row items-center">
          <Text className="text-bold text-slate-900 dark:text-slate-300 mx-2 "
          >To:</Text> 
          <View className=''>
          <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
            className={"text-slate-900 dark:text-slate-300"}
            >{accountB.slice(0,22)}</Text>
            <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
            className={"text-slate-900 dark:text-slate-300"}
            >{accountB.slice(22)}</Text>
          </View>
        </View> 
       
        {accountB 
          ?<View className="flex-row">
            <TouchableOpacity 
            onPress={()=>{setAccountB('')}}
            >
              <Avatar.Icon className='mr-2'
                size={24} icon="close"/>
            </TouchableOpacity>
            {/* 
            <TouchableOpacity
              onPress={()=>{setVisible(true)}}
              >
              <Avatar.Icon size={24} icon="check" />
            </TouchableOpacity>
            */}           
            </View>
          :<TouchableOpacity
              onPress={()=>{setVisible(true);NavigationBar.setVisibilityAsync("hidden");}}
              >
              <Avatar.Icon className='mr-3'
                size={24} icon="camera" />
            </TouchableOpacity>
        }
      </View>
      {(accountB == account.tokens.master.publicKey) && 
          <View className="w-56 flex-row justify-center items-center">
            <Text className='text-red-600 text-xs'> From is the same as To </Text>
          </View>}
       { (chip.length > 0 && accountB.length == 0) 
          ?<TouchableOpacity
            onPress={()=>setAccountB(chip)}
            className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2"
          >
            <View>
              <Text className="w-30 text-xs text-slate-700 dark:text-slate-500 ml-2  "
                >Paste from chipboard</Text>
              <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-2 "
                >{chip.slice(0,6)+'...'}</Text>
            </View>
            <Avatar.Icon className='mr-3'
              size={24} icon="clipboard-check-multiple-outline" />
          </TouchableOpacity>
          
          :<>
          <View
            className='flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2'>
            <TouchableOpacity onPress={()=>{setSelectA(false);setSelectB(true);setIsamountA(false)}}>
              <Avatar.Image className='-ml-3'
                size={56} source={{uri: mintInfo(mintB)?.logo}} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{setIsamountA(false)}}
            >
            <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold"
            >{isamountA?amountB+'   ':amountB+'_'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{setSuccess('Send')}}
            >
              <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-bold ">
                {mintInfo(mintB)?.symbol}</Text>
            </TouchableOpacity>

            </View>
          </>
       }
        { (accountB.length > 0 && Number(amountB) > 0 && Number(amountA) > 0 && 
          (Number(amountA)<=maxValue) && (accountB != account.tokens.master.publicKey)) 
          ?<TouchableOpacity 
            className={'flex-row w-5/6 h-12 justify-center items-center rounded-full px-3 mt-5  bg-indigo-500 dark:bg-slate-600'}

            onPress={()=>setCheck(true)}
          >
              <Text className="text-lg text-slate-900 dark:text-slate-300">Next</Text>
          </TouchableOpacity>
          :<TouchableOpacity 
          className={'flex-row w-5/6 h-12 justify-center items-center rounded-full px-3 mt-5 '}

          onPress={()=>setCheck(true)}
        >
            <Text className="text-lg"></Text>
        </TouchableOpacity>
        }
      <View className="mt-8 android:mt-8">
        <NumberKeyboard onPress={_onPressNumber}/>
      </View>

      {check &&
      <Portal>
        <Appbar.Header  
          style={colorScheme==='dark'? {backgroundColor:'#1e293b'}:{backgroundColor:'#a5b4fc'} } >
          <View className="flex-row items-center  bg-indigo-300  dark:bg-slate-800">
            <TouchableOpacity onPress={()=>{setCheck(false);setSuccess('Send')}}>
                <Avatar.Icon size={48} icon="arrow-left" className="bg-indigo-300 dark:bg-slate-800 mr-3"/>
            </TouchableOpacity>  
            <Text className=" text-slate-800 dark:text-slate-300 font-bold ml-2"
            >Summary</Text>
          </View>     
        </Appbar.Header>
        <View className=" w-full h-full items-center bg-indigo-300 dark:bg-slate-800">
        <View className=" w-full h-3/4 items-center">
          <Text className=" w-5/6 text-slate-900 dark:text-slate-300 ml-2 text-bold" 
          >Exchange </Text>
          <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2">
            <View className="flex-row items-center">
              <Text className=" text-slate-900 dark:text-slate-300 ml-3"
              >from:</Text> 
             <View>
             <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                className={"text-slate-900 dark:text-slate-300 mr-2"}
              >{account.tokens.master.publicKey.slice(0,22)}</Text>
              <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                className={"text-slate-900 dark:text-slate-300 mr-2"}
              >{account.tokens.master.publicKey.slice(22)}</Text>
             </View>
            </View>
          </View>
          <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2">
          <Avatar.Image className='-ml-3'
            size={56} source={{uri: mintInfo(mintA)?.logo}} />
            <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold"
            >{amountA}</Text>
            <View>
              <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-lg text-bold ">
                {mintInfo(mintA)?.symbol}</Text>
            </View>
          </View>
          
          <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-5">
            <View className="flex-row items-center">
              <Text className=" text-slate-900 dark:text-slate-300 ml-3"
              >To: </Text> 
              <View>
              <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                className={"text-slate-900 dark:text-slate-300 mr-2"}
                >{accountB.slice(0,22)}</Text>
                <Text style={{fontFamily: 'monospace', fontSize: 12, fontWeight:"bold"}}
                className={"text-slate-900 dark:text-slate-300 mr-2"}
                >{accountB.slice(22)}</Text>
              </View>
            </View>
          </View>
          <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2">
          <Avatar.Image className='-ml-3'
            size={56} source={{uri: mintInfo(mintB)?.logo}} />
            <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold"
            >{amountB}</Text>
            <View>
              <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-lg text-bold ">
                {mintInfo(mintB)?.symbol}</Text>
            </View>
          </View>
          <View className="flex-row w-5/6 h-14 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-5">
              <Text className=" text-slate-900 dark:text-slate-300 ml-3"
              >Network Fee:</Text> 
              <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 mr-3  "
              >0.00005</Text>
          </View>
          {isLoading && <Waiting/>}
          </View>
          <TouchableOpacity disabled={success != 'Create'}
            className={`flex-row w-5/6 h-14 justify-center items-center rounded-full 
              px-3 bg-indigo-500 dark:bg-slate-600`}
            onPress={()=>exchange_init()}
          >
              <Text className="text-lg text-slate-900 dark:text-slate-300">{success}</Text>
          </TouchableOpacity>
        </View>
      </Portal>
       }
    </View>
    </>
  )
}


const styles = StyleSheet.create({
  text:{
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight:"bold"       
}});


