import {View,Text,TouchableOpacity} from 'react-native'
import { Avatar} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAccounts } from '../context';
import {  Header } from "../components";
import { Cluster } from '@solana/web3.js';
import * as wallet from '../wallet'
import { net } from '../utils';

type RootStackParamList = {
  SetCluster: undefined;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SetCluster'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  
export const SetCluster = ({ navigation }: Props) => {
  const {cluster,setCluster} = useAccounts();
   
  const handleCluster = async(cluster:Cluster) => {
    await wallet.setCluster(cluster);
    setCluster(cluster);
  }

  const netArray = [net.devnet,net.mainnet,net.testnet];

  return (
    <>
    <Header  goBack={()=>{navigation.navigate('DashboardScreen')}}/>   

     <View className={`flex-1 justify-center items-center w-full  bg-indigo-300 dark:bg-slate-800`}>
      <View className={`h-2/3`}>
        {netArray.map((item,index)=>{
          return(
          <TouchableOpacity key={index}
            onPress={()=>{handleCluster(item)}}
            className={`flex-row justify-between my-3 w-72 items-center rounded-full 
              ${(item===cluster)? ` bg-indigo-500 dark:bg-slate-500 `
                                :`  bg-indigo-400 dark:bg-slate-700 `}`}>

            <Avatar.Icon size={64} icon='web'/> 
            <View className={`flex-row items-center mr-6`}>
                <Text className={`text-white`}>{item}</Text>
            </View> 
          </TouchableOpacity>
          )
        })}
      </View>
    </View>
  </>
  );
}


