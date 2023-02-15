import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as LocalAuthentication from 'expo-local-authentication'
import * as React from 'react';
import { useAccounts } from "../context";
import {Waiting} from '../components';
import * as wallet from "../wallet";


type RootStackParamList = {
    AuthenticationScreen: undefined;
  };
  
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'AuthenticationScreen'>;
type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AuthenticationScreen'
  >;
  
type Props = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
 };
  

export const AuthenticationScreen = ({ route, navigation }: Props) =>{
    const {setAccount,setAccounts,setCluster} = useAccounts();
    const [login,setLogin] = React.useState(false);
    const [temp,setTemp] = React.useState<wallet.IAccount[]>([]);

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
            setLogin(true);
            //await loadAccounts();
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
    

    React.useEffect(()=>{
        const asyncRun = async()=>{
            if (!temp.length) {
                const _accounts = await wallet.loadAccounts()
                setTemp(_accounts)
                authenticate();
            }
            
            if(result===EResult.SUCCESS && temp.length){
                await wallet.setAccounts(temp);
                setAccounts(temp);
            }
        }
        asyncRun();
    },[login])
 
    /*
    const loadAccounts = async() =>{
        const _accounts = await wallet.loadAccounts()
        const _cluster = await wallet.getCluster()
        const _account = await wallet.getDefaultAccount(_accounts);
        await wallet.findTokens(_account,_cluster);
        await wallet.setAccounts(_accounts);
        setAccounts(_accounts)
    }*/

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
    
    return (
        isloading?<Waiting/>:<></>
    );
}

