import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image } from 'react-native';

class Settings extends React.Component {
  constructor(props){
    super(props);
  }

  static navigationOptions = {
    title: "Settings",
  };

  render() {

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <Text>Settings</Text>
      </View>
    );
  }
}

export default Settings;