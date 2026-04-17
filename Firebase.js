import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyACv5AIOHAo_Mj3m59OLiYt2_CLjsFKSBY",
  authDomain: "notify-c3bf1.firebaseapp.com",
  databaseURL: "https://notify-c3bf1-default-rtdb.firebaseio.com", // IMPORTANT
  projectId: "notify-c3bf1",
};

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db };