import * as screen from '../screen'
import StackNavigator from './Stack';
import { createDrawerNavigator  } from '@react-navigation/drawer';
//import { Drawer } from 'react-native-paper';
//import {Icon} from 'react-native';
const Drawer = createDrawerNavigator();

//contentComponent:({navigation})=> <DrawerContent navigation={navigation} routes={DrawerRoutes} />,


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="StackNavigator"
      drawerContent={(props) => <screen.DrawerContent {...props}/>}
      screenOptions={{ 
        drawerStyle: {
          backgroundColor: '#64748B',
        },
        drawerLabelStyle:{color:'white'},
        headerShown: false,
      }}
      >
      <Drawer.Screen name="StackNavigator" component={StackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

/*
export default function DrawerNavigator() {
  return (
      <Drawer.Navigator initialRouteName="StackNavigator"
        screenOptions={{ 
          drawerStyle: {
            backgroundColor: '#64748B',
          },
          drawerLabelStyle:{color:'white'},
          headerShown: false,
        }}
        >
        <Drawer.Screen name="SettingScreen" component={screen.SettingScreen} />
        <Drawer.Screen name="HomeScreen" component={screen.HomeScreen} />
        <Drawer.Screen name="FirstScreen" component={screen.FirstScreen} />
        <Drawer.Screen name="StackNavigator" component={StackNavigator} />
      </Drawer.Navigator>
  );
}
*/
/*
const Menu = createDrawerNavigator(
  {
    First: { screen: screen.FirstScreen },
    Second: { screen: screen.HomeScreen }
  },
  {
    contentComponent: props => (
      <ScrollView>
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <Drawer.Item
            label="First Page"
            active="true"
            onPress={() => props.navigation.navigate("First")}
          />
          <Drawer.Item
            label="Second Page"
            active="true"
            onPress={() => props.navigation.navigate("Second")}
          />
        </SafeAreaView>
      </ScrollView>
    )
  }
);
*/