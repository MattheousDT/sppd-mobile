import React from "react";
import {View, Image} from "react-native";
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from "./views/HomeScreen";
import Settings from "./views/Settings";
import Card from "./views/Card";

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: "center"}}>
        <Image
          source={require("./assets/sppd.png")}
          style={{ width: 84, height: 30 }}
        />
      </View>

    );
  }
}


const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Settings: {screen: Settings},
  Card: {screen: Card,
    navigationOptions: {
      header: null,
  }}
},
{
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#1e98a1',
    },
    headerLeft: <View style={{height: 50, width: 50}}></View>,
    headerRight: <View style={{height: 50, width: 50}}></View>,
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

const App = createAppContainer(MainNavigator);

export default App;