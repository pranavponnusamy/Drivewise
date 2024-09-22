// SkillDetailScreen.js
import React from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const SkillDetailScreen = ({ route, navigation }) => {
  const { skill } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Feather
        name="arrow-left"
        size={24}
        color="black"
        style={styles.arrow}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.skillDetail}>
        <Image source={skill.image} style={styles.skillImage} />
        <Text style={styles.skillTitle}>{skill.name}</Text>
        <Text style={styles.skillDescription}>{skill.description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skillDetail: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  skillImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  skillTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  skillDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  arrow: {
    fontSize: 32,
    backgroundColor: "#fff",
    marginTop: 16,
    marginLeft: 16,
  },
});

export default SkillDetailScreen;
