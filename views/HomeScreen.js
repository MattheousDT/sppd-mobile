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
import BottomDrawer from "../components/BottomDrawer";
import CardGrid from "../components/CardGrid"

const themes = ["adventure", "fantasy", "general", "mystical", "sci-fi"];
const rarities = ["common", "rare", "epic", "legendary"];
const orderBy = ["name", "theme", "rarity", "energy", "health", "damage"];

const capitalism = string => string[0].toUpperCase() + string.slice(1);

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cards: [],
      filteredCards: [],
      devTools: false,
      refreshing: false,
      searchColour: "#c5c5c5",
      search: "",
      theme: "",
      rarity: "",
      order: 1,
      sort: "name",

      // faffy dragons cleeeean code

      filters: {
        name: null,
        theme: null,
        rarity: null,
        sort: "name",
        order: 1
      }
    };
  }

  window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
      this.setState({ cards: cards, filteredCards: this.updateCards({ cards }), isLoading: false });
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

  _searchColour = () => {
    if (this.state.searchColour === "#c5c5c5") {
      this.setState({ searchColour: "#1E98A1" });
    } else {
      this.setState({ searchColour: "#c5c5c5" });
    }
  };

  // dragons nice boii vode ahead...$

  updateCards = options => {
    let { cards, filters } = options;

    if (filters == null) {
      filters = this.state.filters;
    }
    if (cards == null) {
      cards = this.state.cards;
    }

    let filteredCards = cards
      .filter(
        e => e.name.toLowerCase().includes((filters.name || "").toLowerCase()) && (filters.theme == null ? true : e.theme === filters.theme) && (filters.rarity == null ? true : e.rarity === filters.rarity)
      );

    if (filters.sort === "name" || filters.sort === "theme") {
      filteredCards.sort((a, b) => {
        if (filters.order === 1) {
          if (a[filters.sort] < b[filters.sort]) {
            return -1;
          }
          if (a[filters.sort] > b[filters.sort]) {
            return 1;
          }
        } else {
          if (a[filters.sort] > b[filters.sort]) {
            return -1;
          }
          if (a[filters.sort] < b[filters.sort]) {
            return 1;
          }
        }
        return 0;
      });
    } else {
      filteredCards.sort((a, b) => 
        filters.order === 1
          ? a[filters.sort] - b[filters.sort]
          : filters.order === -1
          ? b[filters.sort] - a[filters.sort]
          : 0
        );
    }


    this.setState({
      filteredCards
    });

    return filteredCards;
  };

  changeFilter = (filter, value) => {
    let filters = {};

    if (filter instanceof Object) {
      for (let [k, v] of Object.entries(filter)) {
        if (v === "") {
          filter[k] = null;
        }
      }
      filters = {
        ...this.state.filters,
        ...filter
      };
    } else {
      filters = {
        ...this.state.filters,
        ...{ [filter]: value === "" ? null : value }
      };
    }

    this.updateCards({ filters });

    this.setState({
      filters
    });
  };

  filterTheme = theme => {
    if (theme === this.state.filters.theme) {
      return this.changeFilter("theme", null);
    }

    this.changeFilter("theme", theme);
  };

  rarityAsNumber = rarity => {
    switch (rarity) {
      case "common": {
        return 0;
      }
      case "rare": {
        return 1;
      }
      case "epic": {
        return 2;
      }
      case "legendary": {
        return 3;
      }
    }

    return -1;
  };

  filterRarity = rarity => {
    if (this.rarityAsNumber(rarity) === this.state.filters.rarity) {
      return this.changeFilter("rarity", null);
    }

    this.changeFilter("rarity", this.rarityAsNumber(rarity));
  };

  filterName = name => {
    this.changeFilter("name", name);
  };

  clearFilterName = () => {
    this.changeFilter("name", null);
  };

  toggleSort = sort => {
    if (this.state.filters.sort == null || this.state.filters.sort !== sort) {
      this.changeFilter({
        sort,
        order: 1
      });
    } else {
      if (this.state.filters.order === 1) {
        this.changeFilter({
          sort,
          order: -1
        });
      } else {
        this.changeFilter({
          sort: null,
          order: null
        });
      }
    }
  };

  //

  render() {
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
                borderColor: this.state.searchColour,
                borderWidth: 2,
                marginHorizontal: 8,
                paddingHorizontal: 16,
                borderRadius: 12,
                fontSize: 18
              }}
              onFocus={() => {
                this._searchColour();
              }}
              onEndEditing={() => {
                this._searchColour();
              }}
              onChangeText={query => {
                this.filterName(query); console.log(query)
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
            style={{ marginBottom: 38 }}
          >
            <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
              {
                this.state.filteredCards != undefined ? [
                this.state.filteredCards.map((e, i) => (
                  <CardGrid
                    key={i}
                    card={e}
                  />
                ))
              ] : null}
            </View>
          </ScrollView>
          <BottomDrawer icon="filter">
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              {/* Order By */}
              <Text style={{ ...styles.sectionTitle, color: "#ffffff" }}>
                Order By
              </Text>
              <View style={styles.divider} />
              {[
                orderBy.map((e, i) => (
                  <TouchableOpacity key={i} onPress={() => this.toggleSort(e)}>
                    <View style={styles.filterItem}>
                      <MaterialCommunityIcons
                        style={{
                          ...styles.filterItemIcon,
                          color:
                            this.state.filters.sort === e &&
                            this.state.filters.order != null
                              ? "#fff"
                              : "#00000000"
                        }}
                        name={
                          this.state.filters.order === 1
                            ? "sort-ascending"
                            : "sort-descending"
                        }
                        size={16}
                      />
                      <Text style={{...styles.filterText, color: this.state.filters.sort === e ? "#ffffff" : "#ffffffaa"}}>{capitalism(e)}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ]}
            </View>

            {/* Themes */}
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Text style={{ ...styles.sectionTitle, color: "#ffffff" }}>
                Theme
              </Text>
              <View style={styles.divider} />
              {[
                themes.map((e, i) => (
                  <TouchableOpacity key={i} onPress={() => this.filterTheme(e)}>
                    <View style={styles.filterItem}>
                      <MaterialCommunityIcons
                        style={{ ...styles.filterItemIcon, paddingTop: 3, color: this.state.filters.theme === e ? "#ffffff" : "#ffffffaa" }}
                        name={
                          this.state.filters.theme === e
                            ? "circle"
                            : "circle-outline"
                        }
                        size={10}
                      />
                      <Text style={{...styles.filterText, color: this.state.filters.theme === e ? "#ffffff" : "#ffffffaa"}}>{capitalism(e)}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ]}
            </View>

            {/* Rarity */}
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Text style={{ ...styles.sectionTitle, color: "#ffffff" }}>
                Rarity
              </Text>
              <View style={styles.divider} />
              {[
                rarities.map((e, i) => (
                  <TouchableOpacity key={i} onPress={() => this.filterRarity(e)}>
                    <View style={styles.filterItem}>
                      <MaterialCommunityIcons
                        style={{ ...styles.filterItemIcon, paddingTop: 3, color: this.state.filters.rarity === this.rarityAsNumber(e) ? "#ffffff" : "#ffffffaa" }}
                        name={
                          this.state.filters.rarity === this.rarityAsNumber(e)
                            ? "circle"
                            : "circle-outline"
                        }
                        size={10}
                      />
                      <Text style={{...styles.filterText, color: this.state.filters.rarity === this.rarityAsNumber(e) ? "#ffffff" : "#ffffffaa"}}>{capitalism(e)}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ]}
            </View>
          </BottomDrawer>
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
    backgroundColor: "#fff",
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
    fontSize: 20
  },
  filterText: {
    fontSize: 16,
    marginTop: -3,
    fontWeight: "700",
    color: "#C5C5C5"
  },
  filterItemIcon: {
    fontWeight: "700",
    color: "#C5C5C5",
    marginRight: 10
  },
  filterItem: {
    paddingVertical: 5,
    flexDirection: "row"
  }
});

export default HomeScreen;
