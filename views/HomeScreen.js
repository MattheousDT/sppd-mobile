import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ToastAndroid,
  Dimensions,
  TextInput,
  Platform,
  AlertIOS,
  RefreshControl
} from "react-native";
import { FileSystem, LinearGradient } from "expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Drawer from "../components/Drawer";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cards: [],
      devTools: false,
      refreshing: false
    };
  }

  path = FileSystem.documentDirectory;

  window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  };

  colours = {
    rare: "#BB4600",
    epic: "#C1C1C1",
    legendary: "#E9B845",
    adventure: "#4f80ba",
    fantasy: "#d34f5f",
    general: "#857468",
    mystical: "#4b9b38",
    "sci-fi": "#db571d"
  };

  static navigationOptions = {
    title: "Feinwaru SPPD"
  };

  openSideBar = () => {
    openDrawer();
  };

  downloadShit = async () => {
    ToastAndroid.show("Downloading...", ToastAndroid.BOTTOM);
    try {
      let response = await fetch(
        "https://sppd.feinwaru.com/api/v1/cards?limit=0"
      );
      let responseJson = await response.json();

      //If it's successful as fuck like it should be
      if (responseJson) {
        try {
          await AsyncStorage.setItem(
            "cards",
            JSON.stringify(responseJson.data.cards)
          );
          Platform.OS === "android"
            ? ToastAndroid.show("Cards Downloaded", ToastAndroid.BOTTOM)
            : AlertIOS.alert("Cards Downloaded");

          //heres where shit gets messy
          for (let i of responseJson.data.cards) {
            FileSystem.downloadAsync(
              "https://sppd.feinwaru.com/backgrounds/" + i.image + ".jpg",
              FileSystem.documentDirectory + i.image + ".jpg"
            )
              .then(({ uri }) => {
                console.log("Finished downloading to ", uri);
              })
              .catch(error => {
                console.error(error);
              });
          }
          Platform.OS === "android"
            ? ToastAndroid.show("Images Downloaded", ToastAndroid.BOTTOM)
            : AlertIOS.alert("Cards Downloaded");

          //end
        } catch (error) {
          console.log("Yeah, Matt did an uwu: ", error);
        }
      }
    } catch (error) {
      console.error("Yeah, Matt did an uwu: ", error);
    }
  };

  cachedShit = async () => {
    try {
      const value = await AsyncStorage.getItem("cards");
      const cards = await JSON.parse(value);
      ToastAndroid.show("Rendering Cards...", ToastAndroid.LONG);
      this.setState({ cards: cards, isLoading: false });
    } catch (error) {
      console.error("Yeah, Matt did an uwu: ", error);
    }
  };

  cachedShitDate = async () => {
    try {
      let value = await AsyncStorage.getItem("cards");
      let valueJson = await JSON.parse(value);

      if (valueJson) {
        const date = valueJson[0].updated_at;
        ToastAndroid.show(date, ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Yeah, Matt did an uwu: ", error);
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.cachedShit().then(() => {
      this.setState({ refreshing: false });
    });
  };

  componentDidMount = async () => {
    let cards = await AsyncStorage.getItem("cards");
    let cardsJson = await JSON.parse(cards);

    if (cardsJson) {
      this.cachedShit();
    } else {
      this.downloadShit().then(() => {
        this.cachedShit();
      });
    }
  };

  _toggleDevTools = () => {
    if (this.state.devTools) {
      this.setState({ devTools: false });
    } else {
      this.setState({ devTools: true });
    }
  };

  render() {
    let cardsYay = [];
    const {navigate} = this.props.navigation;

    if (this.state.cards.length === 0) {
    } else {
      cardsYay = this.state.cards.map((e, i) => {
        return (
          <View
            key={i}
            style={{
              paddingHorizontal: 8,
              marginBottom: 24,
              width: this.window.width / 2
            }}
          >
            <TouchableOpacity onPress={() => { navigate("Card", e) }}>
            <LinearGradient
              colors={[
                this.colours[
                  e.rarity === 1
                    ? "rare"
                    : e.rarity === 2
                    ? "epic"
                    : e.rarity === 3
                    ? "legendary"
                    : e.theme
                ],
                this.colours[
                  e.rarity === 1
                    ? "rare"
                    : e.rarity === 2
                    ? "epic"
                    : e.rarity === 3
                    ? "legendary"
                    : e.theme
                ],
                this.colours[e.theme]
              ]}
              locations={[0, 0.299, 0.3]}
            >
              <Image
                source={{ isStatic: true, uri: this.path + e.image + ".jpg" }}
                style={{
                  width: this.window.width / 2 - (16 + 14),
                  height: this.window.width / 2 - (16 + 14),
                  margin: 7
                }}
                onPress={() => alert("lol")}
              />
            </LinearGradient>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 22,
                marginTop: 8
              }}
            >
              {e.name}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 18,
                color: "#707070"
              }}
            >
              {e.rarity === 1
                ? "Rare"
                : e.rarity === 2
                ? "Epic"
                : e.rarity === 3
                ? "Legendary"
                : "Common"}{" "}
              |{" "}
              {e.character_type === null
                ? e.type.charAt(0).toUpperCase() + e.type.slice(1)
                : e.character_type.charAt(0).toUpperCase() +
                  e.character_type.slice(1)}
            </Text>

            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 16,
                marginBottom: 8
              }}
            >
              <Text style={{ color: "#03a9f4" }}>
                <MaterialCommunityIcons name="flash" size={16} />
                {" " + e.mana_cost}
              </Text>{" "}
              <Text style={{ color: "#f44336", marginLeft: 8 }}>
                <MaterialCommunityIcons name="heart" size={16} />
                {" " + e.health}
              </Text>{" "}
              <Text style={{ color: "#ff9800", marginLeft: 8 }}>
                <MaterialCommunityIcons name="sword-cross" size={16} />
                {" " + e.damage}
              </Text>
            </Text>
            </TouchableOpacity>
          </View>
        );
      });
    }


    return (
      <View style={{ flex: 1 }}>
        <Drawer>
          <View
            style={{
              paddingVertical: 18
            }}
          >
            <TextInput
              style={{
                height: 48,
                borderColor: "#c5c5c5",
                borderWidth: 2,
                marginHorizontal: 8,
                paddingHorizontal: 16,
                borderRadius: 12,
                fontSize: 18
              }}
              //onChangeText={}
              placeholder={`Search ${this.state.cards.length} cards for...`}
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
              {[cardsYay]}
            </View>
          </ScrollView>
        </Drawer>
      </View>
    );
  }
}

export default HomeScreen;
