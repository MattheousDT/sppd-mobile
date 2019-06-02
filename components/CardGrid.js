import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Image
} from "react-native";
import { FileSystem, LinearGradient } from "expo";
import { withNavigation } from "react-navigation";

class CardGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  };

  path = FileSystem.documentDirectory;

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

  render() {
    return (
      <TouchableHighlight
      underlayColor="#eee" onPress={() => {this.props.navigation.navigate("Card", this.props.card)}}>
      <View
        style={{
          paddingHorizontal: 8,
          marginBottom: 24,
          width: this.window.width / 2
        }}
      >
        <LinearGradient
          colors={[
            this.colours[
              this.props.card.rarity === 1
                ? "rare"
                : this.props.card.rarity === 2
                ? "epic"
                : this.props.card.rarity === 3
                ? "legendary"
                : this.props.card.theme
            ],
            this.colours[
              this.props.card.rarity === 1
                ? "rare"
                : this.props.card.rarity === 2
                ? "epic"
                : this.props.card.rarity === 3
                ? "legendary"
                : this.props.card.theme
            ],
            this.colours[this.props.card.theme]
          ]}
          locations={[0, 0.299, 0.3]}
        >
          <Image
            source={{ isStatic: true, uri: this.path + this.props.card.image + ".jpg" }}
            style={{
              width: this.window.width / 2 - (16 + 14),
              height: this.window.width / 2 - (16 + 14),
              margin: 7
            }}
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
          {this.props.card.name}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "700",
            fontSize: 18,
            color: "#707070"
          }}
        >
          {this.props.card.rarity === 1
            ? "Rare"
            : this.props.card.rarity === 2
            ? "Epic"
            : this.props.card.rarity === 3
            ? "Legendary"
            : "Common"}{" "}
          {this.props.card.character_type === null
            ? this.props.card.type.charAt(0).toUpperCase() + this.props.card.type.slice(1)
            : this.props.card.character_type.charAt(0).toUpperCase() +
              this.props.card.character_type.slice(1)}
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
            {" " + this.props.card.mana_cost}
          </Text>{" "}
          <Text style={{ color: "#f44336", marginLeft: 8 }}>
            <MaterialCommunityIcons name="heart" size={16} />
            {" " + this.props.card.health}
          </Text>{" "}
          <Text style={{ color: "#ff9800", marginLeft: 8 }}>
            <MaterialCommunityIcons name="sword-cross" size={16} />
            {" " + this.props.card.damage}
          </Text>
        </Text>
      </View>
      </TouchableHighlight>
    );
  }
}

export default withNavigation(CardGrid);
