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
export const populationOptions = [
  {
    id: 'all',
    value: '',
    name: 'All'
  },
  {
    id: '5m',
    value: 5000000,
    name: '> 5 M'
  },
  {
    id: '10m',
    value: 10000000,
    name: '> 10 M'
  },
  {
    id: '50m',
    value: 50000000,
    name: '> 50 M'
  }
]