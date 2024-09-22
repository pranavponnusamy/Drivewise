import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import firestore from "@react-native-firebase/firestore";
import { AuthenticationContext } from "../../infra/auth.context";
import ConfettiCannon from "react-native-confetti-cannon"; // Confetti for celebration
import { getUserData, addSkillReq } from "../../api/user.api";
import Slider from "@react-native-community/slider";
import { updateDrivingLevelReq } from "../../api/user.api";
const MAX_CHAR_LIMIT = 20; // Character limit for skills
const ProfileScreen = () => {
  const { user, logOut } = useContext(AuthenticationContext); // Fetch user context and logOut function
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [difficulty, setDifficulty] = useState(0.5);
  const [celebrate, setCelebrate] = useState(false); // For confetti

  const changeLevelBasedOnSlider = async () => {
    await updateDrivingLevelReq(parseFloat(difficulty.toFixed(1)), user);
  };

  const determineLevel = (score) => {
    if (score <= 300) return "Beginner";
    else if (score <= 700) return "Amateur";
    else return "Experienced";
  };

  const getUserDataReq = async () => {
    try {
      const res = await getUserData(user);
      setProfileData(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch user data from Firestore
  useEffect(() => {
    if (user) {
      getUserDataReq();
    }
  }, [user]);

  // Add a new skill
  const addSkill = () => {
    if (
      newSkill.trim().length > 0 &&
      newSkill.trim().length <= MAX_CHAR_LIMIT
    ) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill("");
      setIsAddingSkill(false);
      // Update Firestore
      addSkillReq(newSkill.trim(), user);
    }
  };

  // Handle skill removal confirmation
  const handleSkillPress = (skill) => {
    Alert.alert(
      "Have you improved on this skill?",
      `"${skill}"`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => removeSkill(skill),
        },
      ],
      { cancelable: true }
    );
  };

  // Remove a skill from the list
  const removeSkill = (skillToRemove) => {
    const updatedSkills = profileData.skills.filter(
      (skill) => skill !== skillToRemove
    );
    setProfileData({ ...profileData, skills: updatedSkills });
    // Update Firestore
    firestore().collection("users").doc(user).update({
      skills: updatedSkills,
    });
    // Trigger confetti celebration
    setCelebrate(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No Profile Data Found</Text>
      </SafeAreaView>
    );
  }

  const { stats, skills, driving_score } = profileData;
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logOut}
          onPress={() => logOut()} // Trigger logout function
        >
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Circular Progress for Driving Score */}
        <View style={styles.brainScoreContainer}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={driving_score / 10}
            tintColor="#4CAF50"
            backgroundColor="#e0e0e0"
          >
            {(fill) => (
              <View style={styles.circularTextContainer}>
                <Text style={styles.circularScore}>
                  {profileData.driving_score.toFixed(0)}
                </Text>
                <Text style={styles.circularSubtitle}>
                  {determineLevel(profileData.driving_score)}
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.brainScoreTitle}>Your Driving Score</Text>
        </View>

        {/* Stats Section (Streak, Total Trips, Total Hours) */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak 🔥</Text>
            <Text style={styles.statValue}>{profileData.stats.streak}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Trips 🚘</Text>
            <Text style={styles.statValue}>{profileData.stats.totalTrips}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Hours ⏰</Text>
            <Text style={styles.statValue}>
              {profileData.stats.totalHours.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* Skills to Improve Section */}
        <View style={styles.skillsToImproveContainer}>
          <Text style={styles.skillsTitle}>Skills to Improve</Text>
          <View style={styles.skillsList}>
            {skills?.map((skill, index) => (
              <TouchableOpacity
                key={`${skill}-${index}`}
                onPress={() => handleSkillPress(skill)}
              >
                {renderImprovementSkill(skill)}
              </TouchableOpacity>
            ))}
          </View>
          {/* Add Skill Button */}
          <TouchableOpacity
            style={styles.addSkillButton}
            onPress={() => setIsAddingSkill(true)}
          >
            <Text style={styles.addSkillButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Celebration Animation */}
        {celebrate && (
          <ConfettiCannon
            count={100}
            origin={{ x: -10, y: 0 }}
            onAnimationEnd={() => setCelebrate(false)}
          />
        )}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Adjust Difficulty:{" "}
            {difficulty < 0.5
              ? "Beginner"
              : difficulty < 0.75
              ? "Amateur"
              : "Experienced"}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={driving_score / 1000}
            onValueChange={setDifficulty} // Update difficulty while sliding
            onSlidingComplete={changeLevelBasedOnSlider} // Only send the request after sliding is complete
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4CAF50"
          />
        </View>
      </ScrollView>

      {/* Popup Modal to Add a New Skill */}
      <Modal visible={isAddingSkill} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Add a new skill</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter skill (max 20 characters)"
              value={newSkill}
              onChangeText={setNewSkill}
              maxLength={MAX_CHAR_LIMIT} // Limit character count
            />
            <View style={styles.popupButtons}>
              <TouchableOpacity style={styles.popupButton} onPress={addSkill}>
                <Text style={styles.popupButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => setIsAddingSkill(false)}
              >
                <Text style={styles.popupButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Function to render each skill to improve
const renderImprovementSkill = (skill) => {
  return (
    <View style={styles.improvementSkillBox}>
      <Text style={styles.improvementSkillText}>{skill}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  brainScoreContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  brainScoreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  circularTextContainer: {
    alignItems: "center",
  },
  circularScore: {
    fontSize: 36,
    fontWeight: "bold",
  },
  circularSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  statsContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
  },
  skillsToImproveContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    position: "relative",
    marginTop: 10,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  improvementSkillBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: "auto",
    maxWidth: 150,
    flexDirection: "row",
  },
  improvementSkillText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addSkillButton: {
    backgroundColor: "#4CAF50", // Custom button color
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
    elevation: 5,
  },
  addSkillButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    bottom: 5,
  },
  popupContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#in",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    padding: 10,
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  popupButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  popupButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logOut: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  logOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  settingsButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  settingsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sliderContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  slider: {
    width: 200,
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
