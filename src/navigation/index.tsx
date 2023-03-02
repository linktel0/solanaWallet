import { NavigationContainer } from '@react-navigation/native';
import {Platform} from 'react-native'
import DrawerNavigator from './Drawer'
import { useAccounts } from '../context';
import SettingNavigator from './Setting';
import {useColorScheme } from "nativewind";
import { useEffect } from 'react';
import * as wallet from '../wallet';
import * as NavigationBar from 'expo-navigation-bar';
//import { SafeAreaView } from 'react-native-safe-area-context';

export default function Navigator() {
    const {accounts,colorScheme,toggleColorScheme} = useAccounts();
  
    useEffect(()=>{
        const asyncRun = async() => {
          const theme = await wallet.getTheme();
          if(theme != colorScheme) {
            toggleColorScheme(theme);
          }
          if (Platform.OS==='ios') return;
          await NavigationBar.setBackgroundColorAsync(
            (theme === 'dark')?'#1e293b':'#a5b4fc');
        }
        asyncRun();
      },[])

    console.log('accounts.length',accounts.length)
    return (
        <NavigationContainer>
            {accounts.length>0
              ?<DrawerNavigator/>
              :<SettingNavigator/>
            }
        </NavigationContainer>
    )
};