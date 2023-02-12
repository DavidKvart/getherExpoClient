import React from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";

const RestModal = () => {
  return (
    <TouchableOpacity disabled={true} style={styles.container}>
      <View style={styles.modal}></View>
    </TouchableOpacity>
  );
};

const WIDTH = Dimensions.get("window");
const MODAL_HEIGHT = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    height: 390,
    width: "94%",
    marginTop: 22,

    backgroundColor: "rgba(255, 295, 295,)",
    // borderRadius: 10,
    borderBottomLeftRadius: "35%",
    borderBottomRightRadius: "35%",
    shadowColor: "#171717",

    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    borderColor: "grey",
    borderWidth: 1,
    flex: 1,
    zIndex: 200,
    position: "absolute",
  },
});
export { RestModal };
