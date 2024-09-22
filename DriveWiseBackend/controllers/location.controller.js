const db = require("../config/database");
const { FieldValue } = require("firebase-admin/firestore");

const saveAccident = async (req, res) => {
  const { lat, long } = req.body;
  try {
    const accident_ref = await db
      .collection("accidents")
      .doc("accidents")
      .update({
        accidents: FieldValue.arrayUnion({
          lat,
          long,
          timestamp: new Date(),
        }),
      });
    return res.status(200).send("Accident saved successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error saving accident");
  }
};

const getAccidents = async (req, res) => {
  try {
    const accidents = await db.collection("accidents").doc("accidents").get();
    return res.status(200).send(accidents.data());
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching accidents");
  }
};

module.exports = { saveAccident, getAccidents };
