import React from "react";
import {
  DrawerLayoutAndroid,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class Drawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { devTools: false };
  }

  _toggleDevTools = () => {
    if (this.state.devTools) {
      this.setState({ devTools: false });
    } else {
      this.setState({ devTools: true });
    }
  };

  render() {
    const devTools = (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>Developer Tools</Text>
        <View style={styles.divider} />
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            this.props.children.downloadShit();
          }}
        >
          <Text style={styles.sidebarItem}>Download Cards</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            this.props.children.cachedShit();
          }}
        >
          <Text style={styles.sidebarItem}>Display Card Cache</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            this.props.children.cachedShitDate();
          }}
        >
          <Text style={styles.sidebarItem}>Cached Card Date</Text>
        </TouchableHighlight>
      </View>
    );

    const navigationView = (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={styles.sidebarSection}>
            <View style={styles.divider} />
            <TouchableHighlight
              underlayColor="#eee"
              onPress={() => {
                this.props.navigation.navigate("Settings");
              }}
            >
              <View style={styles.sidebarItem}>
                <MaterialCommunityIcons
                  name="settings"
                  size={16}
                  style={styles.sidebarItemIcon}
                />
                <Text style={styles.sideBarText}>Settings</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#eee"
              onPress={() => {
                this.props.navigation.navigate("About");
              }}
            >
              <View style={styles.sidebarItem}>
                <MaterialCommunityIcons
                  name="information"
                  size={16}
                  style={styles.sidebarItemIcon}
                />
                <Text style={styles.sideBarText}>About</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#eee"
              onPress={() => {
                this._toggleDevTools();
              }}
            >
              <View style={styles.sidebarItem}>
                <MaterialCommunityIcons
                  name="nodejs"
                  size={16}
                  style={styles.sidebarItemIcon}
                />
                <Text style={styles.sideBarText}>
                  {this.state.devTools ? "Disable DevTools" : "Enable DevTools"}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          {this.state.devTools ? devTools : null}
        </ScrollView>
      </View>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
      >
        {this.props.children}
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  sidebarItem: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: "row"
  },
  sideBarText: {
    fontSize: 16,
    marginTop: -3,
    fontWeight: "700",
    color: "#707070"
  },
  sidebarItemIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#707070",
    marginRight: 10
  },
  sidebarTitle: {
    color: "#212529",
    fontSize: 24,
    fontWeight: "700"
  },
  divider: {
    height: 5,
    backgroundColor: "#1E98A1",
    marginVertical: 16,
    width: 67
  },
  sidebarSection: {
    marginBottom: 20
  }
});

export default withNavigation(Drawer);
