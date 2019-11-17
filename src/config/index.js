import { initializeApp } from 'firebase'

const Firebase = initializeApp({
  apiKey: "AIzaSyDDdp4R4-LEcTuEvSq5OigTJAiFt20tpcI",
  authDomain: "worldaria-ebeba.firebaseapp.com",
  databaseURL: "https://worldaria-ebeba.firebaseio.com",
  projectId: "worldaria-ebeba",
  storageBucket: "worldaria-ebeba.appspot.com",
  messagingSenderId: "170761938430"
})

export const database = Firebase.database()
export const auth = Firebase.auth()