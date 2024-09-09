import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(getServiceFile()), // Ensure serviceAccount is defined
  databaseURL: "https://<your-database-name>.firebaseio.com", // Replace with your database URL
});

function getServiceFile() {
  try {
    return require("../firebase.json");
  } catch (error) {
    console.error("Error loading service account key file:", error);
    return null;
  }
}

export const auth = admin.auth();
