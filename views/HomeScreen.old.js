import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image } from 'react-native';

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  static navigationOptions = {
    title: 'Feinwaru SPPD',
    headerStyle: {
      backgroundColor: '#1e98a1',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentDidMount(){
    return fetch('https://sppd.feinwaru.com/api/v1/cards/list')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  cardList = (name, image) => {
    return (
      <View>
        <Image style={{width: 50, height: 50}} source={{uri: `https://sppd.feinwaru.com/backgrounds/${image}.jpg`, cache: 'only-if-cached'}}/>
        <Text>{name}</Text>
      </View>
    )
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => this.cardList(item.name, item.image)}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}

export default HomeScreen;