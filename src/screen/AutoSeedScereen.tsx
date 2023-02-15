import {useEffect, useState,Fragment} from 'react';
import { RouteProp } from '@react-navigation/native';
import {View,TextInput} from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { Button ,Text} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import {  Header,Waiting } from "../components";
import * as wallet from '../wallet';
import { useAccounts } from '../context';


type RootStackParamList = {
    AutoSeedScereen: undefined;
  };
  
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'AutoSeedScereen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AutoSeedScereen'
  >;
  
type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
 };
  
export const AutoSeedScereen = ({ route, navigation }: Props) => {
  const [isLoading,setIsLoading] = useState(false)
  const [mnemonic,setMnemonic] = useState<string>('');
  const [hasCopyed,setHasCopyed] = useState(false);
  const {setAccounts} = useAccounts();

  useEffect(() => {
    const asyncRun = async() => {
      setIsLoading(true)
      try {
        const mnemonic = await wallet.newMnemonic();
        //const mnemonic = "stage sweet pupil dune rough slab solve beach tag hospital size twin"
        const seed     = await wallet.seedFrom(mnemonic);
        const _wallet:wallet.IWallet = {
          pin:'',
          seed: seed,
          mnemonic:mnemonic,
        }
        await wallet.setWallet(_wallet);
        setMnemonic(mnemonic);
      }
      catch {}
      setIsLoading(false)
    }
    asyncRun();

  }, []);

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

  const loadAccounts = async() => {
    setAccounts(await wallet.loadAccounts());
  }

  const renderMnemonic = (mnemonic:string) =>{
    const words = mnemonic.split(' ');
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
              <TextInput editable={false} 
              className={` text-slate-700 dark:text-slate-300 w-28 h-12 bg-indigo-400 dark:bg-slate-700 -ml-10 my-1 mr-1 rounded-full px-1`}> {word} </TextInput>
            </Fragment>
          )
        })}
      </View>
      )
    }
    return wordsUI
  }

  return (
    isLoading
      ?<View className={`w-full h-full justify-center items-center  bg-indigo-300 dark:bg-slate-800`}>
        <Waiting />  
       </View>
      :<>
      <Header goBack={() => navigation.navigate('SetSeedScreen')} />
        <View className={`w-full h-full items-center  bg-indigo-300 dark:bg-slate-800`}>
        <Text
          className={`text-lg text-slate-700 dark:text-slate-300 android:m-5 font-bold mb-1`}
        >Mnemonic</Text>
        <Text
          className={` text-slate-600 dark:text-slate-400 font-medium my-3`}
        >This is the only way to recover the wallet.</Text>
        <Text
          className={` text-slate-600 dark:text-slate-400 font-medium`}
        >Please keep in a safe place!</Text>

        <View className={`h-90 my-7 justify-center `}>
          {renderMnemonic(mnemonic)}
        </View>

        <Button className={`w-80  bg-indigo-500 dark:bg-slate-600`}
          icon="clipboard-check-multiple-outline"
          mode="contained" onPress={() => copyToClipboard(mnemonic)}>
          {hasCopyed ? 'Copyed' : 'Copy it to clipboard'}
        </Button>
        <Button className={`w-80 mt-5 mb-10  bg-indigo-500 dark:bg-slate-600`} 
          mode="contained"
          onPress={() => loadAccounts()}>
          I have saved
        </Button>
      </View>
      </>
  )}
  

