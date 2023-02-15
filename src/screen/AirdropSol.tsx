import {  Header,Waiting,NumberKeyboard } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text,TouchableOpacity, Dimensions } from "react-native";
import { Avatar,Portal, Appbar } from "react-native-paper";
import { useAccounts } from "../context";
import {useColorScheme } from "nativewind";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as NavigationBar from 'expo-navigation-bar';
import * as utils from '../utils';
import { ITokenInfo } from "../wallet";


type RootStackParamList = {
  AirdropSol:undefined ;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AirdropSol'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  

export const AirdropSol = ({ navigation }: Props) =>{
  const {tokenMap,cluster,update,setUpdate} = useAccounts();
  const [visible, setVisible] = useState(false);
  const [toAccount,setToaccount] = useState('');
  const {colorScheme } = useColorScheme();
  const [chip,setChip] = useState('');
  const [text, setText] = useState('');
  const [check, setCheck] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [success,setSuccess] = useState('AirDrop');
  

  const _onPressNumber = (n: string) => {
    if (n=='') return
    (n!='←')?
    setText(text+n)
    :
    setText(text.slice(0,text.length-1));
  };
 
 
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

  const handleBarCodeScanned = ({ type, data }:result) => {
    setToaccount(data);
    setVisible(false);
    NavigationBar.setVisibilityAsync("visible");
  };

  const handleAirdrop = async() => {
    setIsLoading(true);
    try{
      await utils.airdropSol(
        cluster,
        toAccount,
        Number(text),
      )
      setSuccess('Send is Seccess');
    }
    catch (err) {console.log(err); setSuccess('Send is failed')}
    //setUpdate(update+1);
    setIsLoading(false);
  }

  const maxValue = 2.0;
  const height = Dimensions.get('window').height;
  const info:ITokenInfo|undefined = tokenMap.get('So11111111111111111111111111111111111111112');
  return(
    <>
    <Header goBack={() => navigation.navigate('DashboardScreen')} title={'AirdropSol'}/>
    <View className={`w-full h-full items-center bg-indigo-300 dark:bg-slate-800`}>    
      {visible && 
      <Portal>
        <Appbar.Header  
          style={colorScheme==='dark'? {backgroundColor:'#1e293b'}:{backgroundColor:'#a5b4fc'} } >
          <View className="flex-row items-center  bg-indigo-300  dark:bg-slate-800">
            <TouchableOpacity onPress={()=>setVisible(false)}>
                <Avatar.Icon size={48} icon="close" className="bg-indigo-300 dark:bg-slate-800"/>
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
      
      <TouchableOpacity
          className='flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-12'
          onPress={()=>{setSuccess('Send')}}
        >
          <Avatar.Image className='-ml-3'
          size={64} source={{uri: info?.logo}} />
          <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold ">
          {text}</Text>
          <Text className="w-30 text-slate-900 dark:text-slate-300 mr-2 text-lg text-bold ">
          {info?.symbol}</Text>
          
      </TouchableOpacity>
      {(Number(text)>maxValue) && <View className="w-48 flex-row justify-center items-center rounded-full bg-red-100">
        <Text className='w-36 text-red-600'>Max:      2.0 Sol</Text>
      </View>}
 

      <View className="flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-3">
        <View className="flex-row items-center">
          <Text className=" text-slate-900 dark:text-slate-300 ml-3"
          >To:</Text> 
          <View>
            <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-2  "
            >{toAccount.slice(0,23)}</Text>
            <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-2 "
            >{toAccount.slice(23)}</Text>
          </View>
        </View>
        {toAccount 
          ?<View className="flex-row">
            <TouchableOpacity 
            onPress={()=>{setToaccount('')}}
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
              <Avatar.Icon className='mr-2'
              size={24} icon="camera" />
            </TouchableOpacity>
        }
      </View>
      
       { (chip.length > 0 && toAccount.length == 0) 
          ?<TouchableOpacity
            onPress={()=>setToaccount(chip)}
            className="flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-3"
          >
            <View>
              <Text className="w-30 text-xs text-slate-700 dark:text-slate-500 ml-3  "
                >Paste from chipboard</Text>
              <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-3 "
                >{chip.slice(0,6)+'...'}</Text>
            </View>
            <Avatar.Icon className='mr-2'
            size={24} icon="clipboard-check-multiple-outline" />
          </TouchableOpacity>
          
          :<TouchableOpacity disabled={!(toAccount.length > 0 && text.length > 0 &&  (Number(text)<=maxValue))}
            className={`flex-row w-5/6 h-16 justify-center items-center rounded-full px-3 mt-3
             ${(toAccount.length > 0 && text.length > 0 &&  (Number(text)<=maxValue))
              ?' bg-indigo-500 dark:bg-slate-600'
              :' bg-indigo-400 dark:bg-slate-700' } `}
            onPress={()=>setCheck(true)}
          >
              <Text className="text-lg text-slate-900 dark:text-slate-300">Next</Text>
           </TouchableOpacity>
      }
      <View className="mt-8 android:mt-16">
        <NumberKeyboard onPress={_onPressNumber}/>
      </View>

      {check &&
      <Portal>
        <Appbar.Header  
          style={colorScheme==='dark'? {backgroundColor:'#1e293b'}:{backgroundColor:'#a5b4fc'} } >
          <View className="flex-row items-center  bg-indigo-300  dark:bg-slate-800">
            <TouchableOpacity onPress={()=>{setCheck(false);setSuccess('Send')}}>
                <Avatar.Icon size={48} icon="close" className="bg-indigo-300 dark:bg-slate-800"/>
            </TouchableOpacity>  
            <Text className=" text-slate-800 dark:text-slate-300 font-bold ml-2"
            >Summary</Text>
          </View>     
        </Appbar.Header>
        <View className=" w-full h-full items-center bg-indigo-300 dark:bg-slate-800">
        <View className=" w-full h-3/4 items-center">
          <View className='flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-12'>
            <Avatar.Image className='-ml-3'
            size={64} source={{uri: info?.logo}} />
            <Text className="w-30 text-slate-900 dark:text-slate-300 ml-2 text-lg text-bold"
            >{text}</Text>
            <View>
              <Text className="w-30 text-slate-900 dark:text-slate-300 mr-3 text-lg text-bold ">
              {info?.symbol}</Text>
            </View>
          </View>
          
          <View className="flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2">
            <View className="flex-row items-center">
              <Text className=" text-slate-900 dark:text-slate-300 ml-3 "
              >To:</Text> 
              <View>
                <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-2  "
                >{toAccount.slice(0,23)}</Text>
                <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 ml-2 "
                >{toAccount.slice(23)}</Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row w-5/6 h-16 justify-between items-center bg-indigo-400 dark:bg-slate-700 rounded-full px-3 mt-2">
              <Text className=" text-slate-900 dark:text-slate-300 ml-3"
              >Network Fee:</Text> 
              <Text className="w-30 text-xs text-slate-900 dark:text-slate-300 mr-2  "
              >0.0</Text>
          </View>
          {isLoading && <Waiting/>}
          </View>
          <TouchableOpacity disabled={success != 'AirDrop'}
            className={`flex-row w-5/6 h-16 justify-center items-center rounded-full 
              px-3 bg-indigo-500 dark:bg-slate-600`}
            onPress={()=>handleAirdrop()}
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


