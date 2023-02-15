import { View,Text,TouchableOpacity,Button } from "react-native";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {  useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { I18n } from 'i18n-js';

type RootStackParamList = {
  Test: undefined;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Test'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Test'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export const Test = ({ navigation }: Props) =>{
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [update,setUpdate] = useState(0);
  

  const translations = {
    en: { welcome: 'Hello', name: 'jone' },
    cn: { welcome: '你好',   name:'约翰' },
  };
  const i18n = new I18n(translations);
  i18n.locale = 'en';


  console.log(colorScheme);

  return (
    <View className={`flex-1 items-center justify-center bg-primary-dark dark:bg-primary-light`}>
        <TouchableOpacity
          onPress={toggleColorScheme}
          className= {`w-70 h-15 bg-secondary-light`} 
        >
          <Text
            className= {` text-secondary-light`}
          >
            {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
          </Text>
        </TouchableOpacity>
        <Text className= {` text-${colorScheme}-secondary`}>
          {i18n.t('welcome')} {i18n.t('name')}
        </Text>

        <Text className= {` text-${colorScheme}-secondary`}>
          Current locale: {i18n.locale}
        </Text>


      </View>
  );
};