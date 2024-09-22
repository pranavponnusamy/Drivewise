var admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccountKey = require("../serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = getFirestore(app);

module.exports = db;
