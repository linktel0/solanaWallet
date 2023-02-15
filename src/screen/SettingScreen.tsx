import { RouteProp } from '@react-navigation/native';
import {View,Text,TouchableOpacity,ScrollView } from 'react-native'
import { Button,Avatar} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { useAccounts } from '../context';
import {Waiting,Header} from '../components';
import * as wallet from '../wallet';

type RootStackParamList = {
  SettingScreen: undefined;
  };
  
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'SettingScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SettingScreen'
  >;
  
type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
 };
  
export const SettingScreen = ({ route, navigation }: Props) => {
  const {setTokenMap,cluster,accounts,setAccounts,account,setAccount} = useAccounts();
  const [isLoading,setIsLoading] = useState(false);
  
  const handleAddWallet = async() => {
    setIsLoading(true);
    const index  = wallet.getAccountIndex(accounts);
    let _account = await wallet.addAccount(index);
    _account = await wallet.addSubTokens(_account);
    
    const _accounts = await wallet.getAccounts();
    _accounts.splice(index, 0, _account);
    await wallet.setAccounts(_accounts);
    setAccounts(_accounts);
    setDefaultAccount(index); 
    await wallet.updateTokensInfo(_accounts);
    setIsLoading(false);
  }

  const handleRefreshWallet = async() => {
    setIsLoading(true);
    let  _accounts = await wallet.getAccounts();
    for (let i=0; i<_accounts.length; i++) {
      if (_accounts[i].index == account.index) {
        let _account = await wallet.addAccount(account.index);
            _account = await wallet.addSubTokens(_account);
        _accounts[i] = _account;
        setAccount(_account);
        setTokenMap(await wallet.updateTokensInfo(_accounts));
        break;
      } 
    }
    await wallet.setAccounts(_accounts);
    setAccounts(_accounts);
    setIsLoading(false);
  }

  const handleDeleteWallet = async() => {
    let _accounts = await wallet.getAccounts();
    if (accounts.length==1) return;
    for (let i=0; i<_accounts.length; i++) {
      if (_accounts[i].index == account.index) {
        _accounts.splice(i, 1);
        break;
      } 
    }
    await wallet.setAccounts(_accounts);
    setAccounts(_accounts);
    setDefaultAccount(0);
  }

  const setDefaultAccount = async(index: number) => {
    const _accounts = await wallet.getAccounts();
    const _account = _accounts[index];
    setAccount(_account);
    wallet.setDefaultAccount(_account);
  }
  return (
    <>
     <Header goBack={()=>{navigation.navigate('DashboardScreen')}}/>
     <View className={`flex-1 items-center w-full bg-indigo-300 dark:bg-slate-800`}>
     
      <View className={`h-2/3`}>
              
      <ScrollView >
       {accounts.map((_account,index)=>{
        return (
        <TouchableOpacity key={index}
          onPress={()=>{setDefaultAccount(index)}}
          className={`flex-row w-80 mx-7 my-2 items-center rounded-full 
            ${(account.index===index)? ` bg-indigo-500 dark:bg-slate-500 `
            :`  bg-indigo-400 dark:bg-slate-700 `}`}>
            <Avatar.Text size={56} label={(_account.index+1).toString()}/>
            <View className={`flex-col justify-start mx-3`}>
                <Text className={` text-slate-800 dark:text-slate-300  text-sm`}>{_account.title}</Text>
                <Text className={` text-slate-800 dark:text-slate-300  text-xs`}>{(_account.tokens.master.publicKey.slice(0,6)+'...')}</Text>
            </View>
        </TouchableOpacity> 
      )})}
      </ScrollView>
      
      </View>
      <View className='items-center h-10 mt-4'>{isLoading && <Waiting/>}</View>
      <Button  className={`w-80 mt-2 bg-indigo-500 dark:bg-slate-700`}
              disabled={isLoading}
              onPress={() => handleAddWallet()}>
            <Text className={` text-slate-800 dark:text-slate-300 `}>Add wallet</Text>
      </Button>

      <Button  className={`w-80 mt-2 bg-indigo-500 dark:bg-slate-700`}
              disabled={isLoading}
              onPress={() => handleRefreshWallet()}>
            <Text className={` text-slate-800 dark:text-slate-300 `}>Refresh wallet</Text>
      </Button>
      <Button  className={`w-80 mt-2 bg-indigo-500 dark:bg-slate-700`}
              disabled={isLoading}
              onPress={() => handleDeleteWallet()}>
            <Text className={` text-slate-800 dark:text-slate-300 `}>Delete wallet</Text>
      </Button>

    </View>
    </>
  );
}


