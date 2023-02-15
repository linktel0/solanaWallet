import React, {useEffect, useState,Fragment} from 'react';
import {View,TextInput, ScrollView} from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { Button,Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAccounts } from "../context";
import {  Header } from "../components";
import * as wallet from '../wallet';
import {useColorScheme } from "nativewind";


type RootStackParamList = {
    RecoverScereen: undefined;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'RecoverScereen'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  
export const RecoverScreen = ({ navigation }: Props) => {
  const { colorScheme } = useColorScheme();
  const {setAccounts,setAccount} = useAccounts();
  const [isLoading,setIsLoading] = useState(false)
  const [mnemonic,setMnemonic] = useState<string>('');
  const [hasCopyed,setHasCopyed] = useState(false);
  const [reset,setReset] = useState(0);
  const [items,setItems] = useState(['','','','','','','','','','','',''])

  let words:string[] = items;

  useEffect(() => {
    if (mnemonic.length==0) return;
      const asyncRun = async() => {
        setIsLoading(true)
        try { 
          const seed = await wallet.seedFrom(mnemonic);
          const _wallet:wallet.IWallet = {
            pin:'',
            seed: seed,
            mnemonic:mnemonic,
          }
          await wallet.setWallet(_wallet);
          setReset(reset+1)
        }
        catch {}
        setIsLoading(false)
    }
    asyncRun();

  }, [mnemonic]);

  useEffect(()=>{
    if(mnemonic.length>0)
      loadAccounts();
  },[reset])

  useEffect(()=>{
  },[colorScheme])

  useEffect(()=>{
    const asyncRun = () => {
      setTimeout(() => {
        setHasCopyed(false)
      }, 2000);
    }
    if (hasCopyed) asyncRun()
  },[hasCopyed])

  const loadAccounts = async() => {
    setAccounts(await wallet.loadAccounts());
  }

  const copyToClipboard = async (mnemonic:string) => {
    await Clipboard.setString(mnemonic);
    setHasCopyed(true)
  };

  const convertToMnemonic = (words:string[]) =>{
    let temp = words.reduce((sum,word)=>sum + ' ' + word,'')
    setMnemonic(temp.slice(1));
  }

  const renderMnemonic = (words:string[]) =>{
    const wordsUI =[];
    for (let i=0;i<6;i++){
      wordsUI.push(
      <View key={i} className={`flex-row`}>
        {words.slice(2*i,2*(i+1)).map((word,index)=>{
          return (
            <Fragment key={2*i+index}>
              <TextInput editable={false} 
                className={` text-slate-600 dark:text-slate-400 w-20 h-12 bg-indigo-400 dark:bg-slate-700 my-1 ml-2 rounded-full px-4`}>
                {((2*i+index)<9? '  ' : '') + (2*i+index+1).toString()}.</TextInput>
              <TextInput autoCapitalize='none'
                //onChangeText={(value)=>words[2*i+index]=value}
                onChangeText={(value)=>{words[2*i+index]=value;setItems(words)}}
                className={` text-slate-700 dark:text-slate-300 w-28 h-12 bg-indigo-400 dark:bg-slate-700 -ml-10 my-1 mr-1 rounded-full px-1`}>
                {word}</TextInput>
            </Fragment>
          )
        })}
      </View>
      )
    }
    return wordsUI
  }

    return (
      <>
      {isLoading ?<Header/>:<Header goBack={() => navigation.navigate('SetSeedScreen')} />}
      <View className={`w-full h-full items-center  bg-indigo-300 dark:bg-slate-800`}>
        <Text
        className={`text-lg text-slate-700 dark:text-slate-300 font-bold android:m-10 mb-3`}
        >Mnemonic</Text>
        <Text
        className={` text-slate-700 dark:text-slate-300 font-medium my-3`}
        >Input your mnemonic. </Text>
        
        <View className={`h-1/2 my-7`}>
          {//Platform.OS!='ios'?
            //renderMnemonic(words) 
            //:
           <ScrollView >
             {renderMnemonic(words)} 
            <View className={`h-32`}></View>
           </ScrollView>
          }
        </View>

        {mnemonic.length > 0 &&
        <Button className={`w-72 -mt-5 bg-indigo-500 dark:bg-slate-600`} 
            icon="clipboard-check-multiple-outline" 
            mode="contained" onPress={()=>copyToClipboard(mnemonic)}>
            {hasCopyed?'Copyed':'Copy it to clipboard'}
        </Button>
        }
        <Button className={`w-72 mt-5 mb-10  bg-indigo-500 dark:bg-slate-600`}
            mode="contained" 
            onPress={() => {convertToMnemonic(words)}}>
            Next
        </Button>
      </View>
    </>
    );
  }

