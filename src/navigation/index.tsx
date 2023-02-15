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
    const {accounts} = useAccounts();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    
    useEffect(()=>{
        const changeColor = async() => {
          await toggleColorScheme();
          await wallet.setTheme(colorScheme);
          if (Platform.OS==='ios') return;
          await NavigationBar.setBackgroundColorAsync(
            (colorScheme === 'dark')?'#a5b4fc':'#1e293b');
        }
        changeColor();
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