import { View} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { useAccounts } from "../context";
import {Waiting} from '../components';
import * as wallet from '../wallet';
import { Button,Avatar,useTheme } from 'react-native-paper';


type RootStackParamList = {
  SetWalletScreen:{Pin?:boolean,Seed?:boolean,Login:boolean};
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'SetWalletScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SetWalletScreen'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export const SetWalletScreen = ({ navigation,route }: Props) => {
    const {colors} = useTheme();
    const [isLoading,setIsloading] = useState(true);
    const {setAccounts} = useAccounts();
    const [hasPin,setHasPin] = useState(false);
    const [hasSeed,setHasSeed] = useState(false);
    const [reset,setReset] = useState(0);
    const [login,setLogin] = useState(false);
    
    useEffect(()=>{
      const asyncRun = async() =>{
        setIsloading(true);
        //await wallet.removeAccounts();
        //await wallet.removeWallet();
        const _wallet = await wallet.getWallet();
        //_wallet.pin?setHasPin(true):setHasPin(false);
        _wallet.seed?setHasSeed(true):setHasSeed(false);   
        setIsloading(false)
      }
      asyncRun();
    },[])

    if (route.params?.Pin){
        if(!hasPin) setHasPin(true);
    }

    if (route.params?.Login){
      if(!login) setLogin(true);
    }

    if (route.params?.Seed){
        if (!hasSeed) {
          setHasSeed(true);
          setLogin(true);
        }
    }
    
    useEffect(()=>{
        if (isLoading) return;
        console.log('?????????',hasSeed.toString()+login.toString());
        hasSeed?login?loadAccounts()
        :navigation.navigate("AuthScreen")
        :navigation.navigate("SetSeedScreen")
        //:navigation.navigate("SetPinScreen")
        
    },[hasSeed,reset,login,isLoading])

    const loadAccounts = async() => {
      setAccounts(await wallet.loadAccounts());
    }
   
    return (
      isLoading? <Waiting/>
      :
      <View className='justify-center items-center bg-teal-300'>
      {/*<View style={{...tw`flex-1 justify-center items-center`,backgroundColor:colors.primary}}>*/}
          <View className='h-3/6'>
            <Avatar.Image size={240} source={require("../../assets/images/panda.png")} />
          </View> 
          <Button className='w-60 bg-teal-600'
            mode="contained" onPress={() => setReset(reset+1)}>
            Create your Wallet 
          </Button>
        </View>
    );
};


