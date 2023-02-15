import {Portal ,FAB,useTheme,Avatar} from 'react-native-paper'
import { useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { View ,Platform,Text, TouchableOpacity} from 'react-native';
import * as screen from '../screen'
import {useColorScheme } from "nativewind";
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect, useState } from 'react';
import * as wallet from '../wallet';
import { useAccounts } from '../context';
import { StackNavigationProp } from '@react-navigation/stack';


/*
type RootStackParamList = {
  TabNavigator: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TabNavigator'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};
*/

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  
  const { colorScheme } = useColorScheme();
  //const [state, setState] = useState({ open: false });
  //const { open } = state;
  //const isFocused = useIsFocused();
  //const onStateChange = ({ open }) => setState({ open });

  const {update,setUpdate} = useAccounts();

  return (
    <>
    <Tab.Navigator 
      screenOptions={{ 
        tabBarStyle: {
          backgroundColor: colorScheme === "light"?'#818cf8':'#283548',
        },
        headerShown: false,
      }}>

      <Tab.Screen name="DashboardScreen" component={screen.DashboardScreen} 
       options={{
        tabBarLabel:()=>null,
        tabBarIcon: ({focused}) => (
          <Avatar.Icon size={focused?40:36} 
            icon='currency-usd' 
            color = {colorScheme === "light"?'#1e293b':'#e2e8f0'}
            //className={!focused && `bg-slate-500`}
            className={` bg-indigo-500 dark:bg-slate-600`}/>
        ),
      }}/>
      {
      <Tab.Screen name="Collections" component={screen.TestScreen} 
        options={{
          tabBarLabel:()=>null,
          tabBarIcon: ({focused}) => { return (
            <Avatar.Icon size={focused?40:36} 
              icon='view-grid' 
              color = {colorScheme === "light"?'#1e293b':'#e2e8f0'} 
              //className={!focused &&`bg-slate-500`}
              className={` bg-indigo-500 dark:bg-slate-600`}/>
          )},
      }}/>
     }
      <Tab.Screen name="Histroy" component={screen.History} 
        initialParams={{ itemId: 42 }}
        options={{ 
          tabBarLabel:()=>null,
          tabBarIcon: ({focused}) => (
            <Avatar.Icon size={focused?40:36} 
              icon='lightning-bolt' 
              color = {colorScheme === "light"?'#1e293b':'#e2e8f0'} 
              //className={!focused &&`bg-slate-500`}
              className={` bg-indigo-500 dark:bg-slate-600`}/>
          ),
      }}/>

    </Tab.Navigator>
   
     {/* false &&
    <Portal>
      <FAB.Group
          open={open}
          visible = {isFocused}
          style={{
            position: 'absolute',
            bottom: 54,
            right: 6,
          }}
          icon={open ? 'calendar-today' : 'plus'}
          //color='#e2e8f0'
          actions={[
            { icon: 'plus', 
              label: 'Mint Token',
              onPress: () => console.log('Pressed add') 
            },
            {
              icon: 'star',
              label: 'Airdrop Sol',
              onPress: () => {navigation.navigate('AirdropSol')},
            },
            {
              icon: 'email',
              label: 'Airdrop USDC',
              onPress: () => console.log('Pressed email'),
            },
      
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => console.log('Pressed notifications'),
            },
      
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              console.log('hello')
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    */}
  </>
  );
}