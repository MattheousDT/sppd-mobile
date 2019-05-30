import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Dimensions } from 'react-native';
import Drawer from "../components/Drawer";

class Card extends React.Component {
  constructor(props){
    super(props);
  }

  card = this.props.navigation.state.params

  window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  };

  static navigationOptions = {
    title: "Card",
  };

  render() {

    return(
      <View style={{flex: 1}}>
        <Drawer>
          <View style={{marginHorizontal: 8}}>
            <View style={{width: window.width, borderBottomColor: "#1e98a1", borderBottomWidth: 5}}>
              <Text style={{...styles.boldBoii, fontSize: 37}}>{this.card.name}</Text>
            </View>

            <Text style={styles.sectionTitle}>AWESOM-O Discord Commands</Text>
            <View style={styles.divider} />
            <View style={{marginHorizontal: -8, backgroundColor: "#333", paddingHorizontal: 16, paddingVertical: 8}}>
              <Text style={styles.code}>-card {this.card.name.toLowerCase()}</Text>
              <Text style={styles.code}>-card {this.card.aliases[0].toLowerCase()}</Text>
              <Text style={styles.code}>-card {this.card.aliases[1].toLowerCase()}</Text>
            </View>
          </View>
        </Drawer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boldBoii: {
    color: "#212529",
    fontWeight: "700"
  },
  divider: {
    height: 5,
    backgroundColor: "#1E98A1",
    marginVertical: 16,
    width: 67
  },
  code: {
    color: "#cccccc",
    fontSize: 13,
    marginVertical: 5
  },
  sectionTitle: {
    color: "#212529",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 40
  }
});

export default Card;