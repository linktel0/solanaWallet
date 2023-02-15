import {View} from 'react-native';
import { ActivityIndicator} from 'react-native-paper';
import {useColorScheme } from "nativewind";

const Waiting = ()=>{
    const { colorScheme, toggleColorScheme } = useColorScheme();
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size={'large'} 
            color={colorScheme=='dark'? '#475569':'#818cf8'}
            />
        </View>
    );
}

export default Waiting