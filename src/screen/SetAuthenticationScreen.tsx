import { StackNavigationProp } from "@react-navigation/stack";
import { View,Text} from "react-native";
import * as LocalAuthentication from 'expo-local-authentication'
import * as React from 'react';
import {Waiting,Header} from '../components';
import {Button,Avatar,Switch} from 'react-native-paper'




type RootStackParamList = {
    SetAuthenticationScreen: undefined;
  };
  
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SetAuthenticationScreen'
  >;
  
type Props = {
    navigation: ProfileScreenNavigationProp;
 };
  


export const SetAuthenticationScreen = ({ navigation }: Props) =>{
    const [isSwitchOn, setIsSwitchOn] = React.useState(true);

    enum EResult {
        CANCELLED = 'CANCELLED',
        DISABLED = 'DISABLED',
        ERROR = 'ERROR',
        SUCCESS = 'SUCCESS',
      }
    
    const [facialRecognitionAvailable, setFacialRecognitionAvailable] = React.useState(false);
    const [fingerprintAvailable, setFingerprintAvailable] = React.useState(false);
    const [irisAvailable, setIrisAvailable] = React.useState(false);
    const [isloading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<EResult>();
    
  

    const checkSupportedAuthentication = async () => {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types && types.length) {
        setFacialRecognitionAvailable(types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION));
        setFingerprintAvailable(types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
        setIrisAvailable(types.includes(LocalAuthentication.AuthenticationType.IRIS));
        }
    };
    
    const authenticate = async () => {
        if (isloading) {
        return;
        }
    
        setIsLoading(true);
    
        try {
        const results = await LocalAuthentication.authenticateAsync();
    
        if (results.success) {
            setResult(EResult.SUCCESS);
        } else if (results.error === 'unknown') {
            setResult(EResult.DISABLED);
        } else if (
            results.error === 'user_cancel' ||
            results.error === 'system_cancel' ||
            results.error === 'app_cancel'
        ) {
            setResult(EResult.CANCELLED);
        }
        } catch (error) {
        setResult(EResult.ERROR);
        }
    
        setIsLoading(false);
    };
    
    React.useEffect(() => {
        checkSupportedAuthentication()
    }, []);

    
    let resultMessage;
    switch (result) {
        case EResult.CANCELLED:
        resultMessage = 'Authentication process has been cancelled';
        break;
        case EResult.DISABLED:
        resultMessage = 'Biometric authentication has been disabled';
        break;
        case EResult.ERROR:
        resultMessage = 'There was an error in authentication';
        break;
        case EResult.SUCCESS:
        resultMessage = 'Successfully authenticated';
        break;
        default:
        resultMessage = '';
        break;
    }
    
    let description;
    if (facialRecognitionAvailable && fingerprintAvailable && irisAvailable) {
        description = 'Authenticate with Face ID, touch ID or iris ID';
    } else if (facialRecognitionAvailable && fingerprintAvailable) {
        description = 'Authenticate with Face ID or touch ID';
    } else if (facialRecognitionAvailable && irisAvailable) {
        description = 'Authenticate with Face ID or iris ID';
    } else if (fingerprintAvailable && irisAvailable) {
        description = 'Authenticate with touch ID or iris ID';
    } else if (facialRecognitionAvailable) {
        description = 'Authenticate with Face ID';
    } else if (fingerprintAvailable) {
        description = 'Authenticate with touch ID ';
    } else if (irisAvailable) {
        description = 'Authenticate with iris ID';
    } else {
        description = 'No biometric authentication methods available';
    }

    const handleSwitch = () =>{
        if(!isSwitchOn) authenticate();
        setIsSwitchOn(!isSwitchOn);  
    }

    const handleNext = () =>{
        authenticate();
        navigation.navigate("SetSeedScreen")
    }
    
    return (
        isloading
        ?
        <Waiting/>
        :
        <>
        <Header/>
        <View className="flex-1 items-center bg-indigo-300 dark:bg-slate-800">

          <View>
            <Avatar.Image size={240} source={require("../assets/panda.png")} />
          </View> 
          <Text
            className={`text-2xl text-slate-700 dark:text-slate-300 mt-10 mb-5`}
          > Protect your wallet </Text>

          <Text
            className={`text-lg  text-slate-600 dark:text-slate-400 flex-wrap mx-5`}
          > Biometrics ensure only </Text>
          <Text
            className={`text-lg  text-slate-600 dark:text-slate-400 flex-wrap mx-5`}
          > you can access your wallet </Text>

          
          <View>
            <View className={`justify-between items-center flex-row mt-10 bg-indigo-400 dark:bg-slate-700 px-2 rounded-full`}>
            
                <Avatar.Icon size={56} icon="fingerprint" className={`bg-indigo-400 dark:bg-slate-700 -ml-2`} /> 
                
                <Button className={`bg-indigo-400 dark:bg-slate-700 -ml-3`}
                    mode="contained" onPress={() => setIsSwitchOn(!isSwitchOn)}>
                    <Text className={`w-10 text-base ml-5 text-slate-700 dark:text-slate-300`}>      Use device    </Text>
                </Button>
    
                <Switch color='#ffffff' 
                    value={isSwitchOn} 
                    onValueChange={()=>setIsSwitchOn(!isSwitchOn)}
                /> 
            </View>

            <Button className={`bg-indigo-400 dark:bg-slate-700 mt-10 mb-20 rounded-full`}
                mode="contained" onPress={() => handleNext()}>
                <Text className={`text-base ml-5  text-slate-700 dark:text-slate-300 `}>Next</Text>
            </Button>  
          </View>         
        </View>
        </>
    );
}

