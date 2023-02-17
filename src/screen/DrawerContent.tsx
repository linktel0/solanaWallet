import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {  DrawerContentScrollView} from '@react-navigation/drawer';
import { Avatar, Text} from 'react-native-paper';
const panda = require('../assets/panda.png')
import { useAccounts } from "../context";
import { StackNavigationProp } from '@react-navigation/stack';
import { net,web } from '../utils';
import * as wallet from '../wallet'
import { Cluster } from '@solana/web3.js';


type RootStackParamList = {
  DrawerContent: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DrawerContent'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export const DrawerContent = ({navigation}:Props) => {
    const {account,cluster,setCluster,explorer,setExplorer} = useAccounts();
    const [visible,setVisible] = useState(false);
    const [item,setItem] = useState(0);

    const handleCluster = async(cluster:Cluster) => {
      setVisible(false);
      await wallet.setCluster(cluster);
      setCluster(cluster);
    }

    const handleExplorer = async(explorer:web) => {
      setVisible(false);
      await wallet.setExplorer(explorer);
      setExplorer(explorer);
    }
    
  return (
    <DrawerContentScrollView>       
      <View className='mx-4'>
        <View  className='flex-row items-center'>
          <Avatar.Image source={panda} size={64} /> 
          <Text
            className='text-lg ml-5 font-bold'>
            Setting</Text>
        </View>
        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('SettingScreen')}}
          className='flex-row mt-8 justify-between items-center bg-slate-700 rounded-full'>
            <View className='flex-row items-center'>
                <Avatar.Text size={48} label={(account.index+1).toString()} />
                <Text className='text-white text-sm m-2'>Wallet</Text>
            </View>
            <View className='flex-row items-center mr-2'>
                <Text className='text-white text-xs'>{account.tokens.master.publicKey.slice(0,6)+'...'} ➛</Text>
            </View> 
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setVisible(!visible);setItem(1)}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='web'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{cluster+' ➛'}</Text>
            </View> 
            
        </TouchableOpacity>

        { visible && item ==1 && <View className='ml-10'>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleCluster(net.devnet)}}>
              <Text className='text-slate-200 ml-4'>{net.devnet}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleCluster(net.mainnet)}}>
              <Text className='text-slate-200 ml-4'>{net.mainnet}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'   
              onPress={()=>{handleCluster(net.testnet)}}>
              <Text className='text-slate-200 ml-4'>{net.testnet}</Text>
          </TouchableOpacity>
        </View> }

        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('MintScreen')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Text size={48} label='M'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'MintToken ➛'}</Text>
            </View> 
            
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('AirdropSol')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='water-pump'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'AirdropSol ➛'}</Text>
            </View> 
            
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('AirdropToken')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='water-pump'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'AirdropUSDC ➛'}</Text>
            </View> 
            
        </TouchableOpacity>
      
        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('SafeTransfer')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='arrow-right-thin'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'SafeTransfer ➛'}</Text>
            </View> 
            
        </TouchableOpacity>
    
        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('SafeExchange')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='arrow-left-right'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'SafeExchange ➛'}</Text>
            </View> 
            
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={()=>{setVisible(false);navigation.navigate('RemoveRecoveryPhrase')}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='cog'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{'RecoveryPhrase ➛'}</Text>
            </View> 
            
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={()=>{setVisible(!visible);setItem(2)}}
          className='flex-row justify-between mt-4 items-center bg-slate-700 rounded-full'>
            <Avatar.Icon size={48} icon='cloud-outline'/> 
            <View className='flex-row items-center mr-2'>
                <Text className='text-white'>{explorer+' ➛'}</Text>
            </View> 
        </TouchableOpacity>

        { visible && item==2 && <View className='ml-10'>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleExplorer(web.SolanaFM)}}>
              <Text className='text-slate-200 ml-3'>{web.SolanaFM}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleExplorer(web.Solana_Beach)}}>
              <Text className='text-slate-200 ml-3'>{web.Solana_Beach}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleExplorer(web.Solana_Explorer)}}>
              <Text className='text-slate-200 ml-3'>{web.Solana_Explorer}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              className='bg-slate-600 rounded-full w-40 h-8 mt-3'
              onPress={()=>{handleExplorer(web.Solscan)}}>
              <Text className='text-slate-200 ml-3'>{web.Solscan}</Text>
          </TouchableOpacity>
        </View> }
      </View>
    </DrawerContentScrollView>
  );
}
