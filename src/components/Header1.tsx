import { Appbar,Avatar } from "react-native-paper";
import {TouchableOpacity,Text,View,Platform} from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from "react";
import { Cluster } from "@solana/web3.js";
import * as NavigationBar from 'expo-navigation-bar';
import * as wallet from '../wallet';
import { useAccounts } from '../context';

type Props = {
  cluster: Cluster;
  account: wallet.IAccount;
  goBack?: () => void;
  goTo?: () => void;
  goTo1?: () => void;
};

const Header = ({cluster,account,goBack,goTo,goTo1}:Props) => {
  const { colorScheme, toggleColorScheme } = useAccounts();
  const [hasCopyed,setHasCopyed] = useState(false);
  
  const copyToClipboard = async (publicKey:string) => {
    await Clipboard.setString(publicKey);
    setHasCopyed(true)
  };

  useEffect(()=>{
    const asyncRun = () => {
      setTimeout(() => {
        setHasCopyed(false)
      }, 2000);
    }
    if (hasCopyed) asyncRun()
  },[hasCopyed])

  if (account === undefined) return (<></>)

  const changeColor = async() => {
    
    const newScheme =  (colorScheme === 'dark')?'light':'dark';
    toggleColorScheme(newScheme);
    await wallet.setTheme(newScheme);
    if (Platform.OS==='ios') return;
    await NavigationBar.setBackgroundColorAsync(
      (newScheme === 'dark')?'#1e293b':'#a5b4fc');
  }

  return(
    <Appbar.Header statusBarHeight={20} className={`justify-between  bg-indigo-400 dark:bg-slate-700`}>
       <View className={`flex-row items-center`}>
        <TouchableOpacity onPress={goBack}>
          <Avatar.Text size={32} label={(account.index+1).toString()}
          className={`ml-2 mr-5`}/>
        </TouchableOpacity>  
        {!hasCopyed &&
          <TouchableOpacity onPress={()=>copyToClipboard(account.tokens.master.publicKey)}>
            <View className={`items-center`}>
              <Text className={`text-base -mb-1 text-slate-700 dark:text-slate-300 font-bold`}>   
                {account.title}
              </Text> 
              <Text className={`text-sm -mt-1 text-slate-700 dark:text-slate-300`}>   
                {account.tokens.master.publicKey.slice(0,6)+'...'}
              </Text>     
            </View>
          </TouchableOpacity>
        }
        </View>

        {hasCopyed && <Text className={`ml-2 text-base  text-slate-700 dark:text-slate-300`}>   
                        The address is copyed
                      </Text>
        }

        <View className={`flex-row justify-between`}>
        {!hasCopyed && 
          <TouchableOpacity onPress={goTo1}>
            <Text className={`text-base  text-slate-700 dark:text-slate-300 font-bold`}>{cluster.slice(0,1).toUpperCase()+cluster.slice(1)}</Text>
          </TouchableOpacity>
        }
          <TouchableOpacity className={`ml-5 mr-2`} onPress={changeColor}> 
            <Avatar.Text  size={32} label={colorScheme === "dark" ? "🌙" : "🌞"}
              className="bg-yellow-100 dark:bg-slate-800"
            />
          </TouchableOpacity>       
        </View>  
    </Appbar.Header>

  )
};

export default Header;
