const db = require("../config/database");
const { FieldValue } = require("firebase-admin/firestore");

const createUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user_ref = await db
      .collection("users")
      .doc(userId)
      .set({
        trips: [],
        skills: [],
        stats: {
          streak: 0,
          totalHours: 0,
          totalTrips: 0,
        },
        drivingLevel: 0,
      });
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

const getUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    const userRef = db.collection("users").doc(userId);
    const user = await userRef.get();
    const userData = user.data();
    if (!user.exists) {
      return res.status(500).json({ message: "User does not exist. " });
    }
    return res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting saved images" });
  }
};

const addNewTrip = async (req, res) => {
  const { userId, trip } = req.body;
  try {
    const userRef = db.collection("users").doc(userId);

    // Fetch the user's current trips
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();
    const currentTrips = userData.trips || [];
    // Sort the trips by time in descending order
    currentTrips.sort((a, b) => new Date(b.time) - new Date(a.time));

    let streak = userData.stats?.streak || 0;

    if (currentTrips.length > 0) {
      const lastTripTime = new Date(currentTrips[0].time);
      const newTripTime = new Date(trip.time);

      const timeDifference = Math.floor(
        (newTripTime - lastTripTime) / (1000 * 60 * 60 * 24)
      );

      // Check if the new trip is within a day of the last trip
      if (timeDifference === 1) {
        streak += 1; // Continue the streak
      } else if (timeDifference > 1) {
        streak = 1; // Reset the streak
      }
    } else {
      streak = 1; // First trip, start the streak
    }

    // Update the user's trips and stats with dot notation for nested fields
    await userRef.update({
      trips: FieldValue.arrayUnion(trip),
      "stats.totalTrips": FieldValue.increment(1),
      "stats.totalHours": FieldValue.increment(trip.duration),
      "stats.streak": streak,
    });

    // Fetch updated stats after update
    const updatedUserSnapshot = await userRef.get();
    const updatedUserData = updatedUserSnapshot.data();
    const totalTrips = updatedUserData.stats?.totalTrips || 0;
    const totalHours = updatedUserData.stats?.totalHours || 0;
    return res.status(200).json({ streak, totalHours, totalTrips });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding trip" });
  }
};

const addNewSkill = async (req, res) => {
  const { userId, skill } = req.body;
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      skills: FieldValue.arrayUnion(skill),
    });
    return res.status(200).json({ message: "Skill added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error adding skill" });
  }
};

const updateUserDrivingLevel = async (req, res) => {
  const { userId, drivingLevel } = req.body;
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      drivingLevel,
    });
    return res
      .status(200)
      .json({ message: "Driving level updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating driving level" });
  }
};

module.exports = {
  createUser,
  getUserData,
  addNewTrip,
  addNewSkill,
  updateUserDrivingLevel,
};
