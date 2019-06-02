import React from "react";
import {
  DrawerLayoutAndroid,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  Animated,
  ToastAndroid,
  BackHandler
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class BottomDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { opened: false, height: new Animated.Value(-281) };
  }

  window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  };

  openDrawer = () => {
    if (this.state.opened) {
      this.setState({ opened: false });
      Animated.spring(this.state.height, {
        toValue: -281,
      }).start();
    } else {
      this.setState({ opened: true });
      Animated.spring(this.state.height, {
        toValue: -10,
      }).start();
    }
  };

  render() {

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.opened) {
        this.openDrawer();
        return true;
      }
      return false;
    });

    return (
      <Animated.View
        style={{
          height: 326,
          width: this.window.width,
          backgroundColor: "#1e98a1",
          zIndex: 998,
          position: "absolute",
          left: 0,
          bottom: this.state.height,
          marginTop: 100,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25
        }}
      >
        <TouchableHighlight
          style={{
            width: 55,
            height: 55,
            backgroundColor: "#1e98a1",
            borderRadius: 100,
            zIndex: 999,
            position: "absolute",
            top: -20,
            left: this.window.width / 2 - 55 / 2,
            alignContent: "center",
            justifyContent: "center"
          }}
          onPress={() => {
            this.openDrawer()
          }}
          underlayColor="#1e98a1"
          onLongPress={() => {ToastAndroid.show("Filter Options", ToastAndroid.LONG);}}
        >
          <MaterialCommunityIcons
            name={this.props.icon}
            size={30}
            style={{ color: "#ffffff", textAlign: "center" }}
          />
        </TouchableHighlight>
        <View style={{marginTop: 55, marginBottom: 38, marginHorizontal: 8, flex: 1, flexDirection:"row"}}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

export default BottomDrawer;
