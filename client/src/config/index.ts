import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

function getFirestoreInstance() {
  const envVariables = [
    'VITE_APP_API_KEY',
    'VITE_APP_AUTH_DOMAIN',
    'VITE_APP_DATABASE_URL',
    'VITE_APP_PROJECT_ID',
    'VITE_APP_STORAGE_BUCKET',
    'VITE_APP_MESSAGING_SENDER_ID'
  ]

  for (const variable of envVariables) {
    if (!(variable in import.meta.env)) {
      throw new Error(`Variable ${variable} is not set in .env file`)
    }
  }

  const app = initializeApp({
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_APP_DATABASE_URL,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID
  })

  return getFirestore(app)
}

export const firestore = getFirestoreInstance()

export const populationOptions = [
  {
    value: 'all',
    title: 'All'
  },
  {
    value: '5000000',
    title: '> 5 M'
  },
  {
    value: '10000000',
    title: '> 10 M'
  },
  {
    value: '50000000',
    title: '> 50 M'
  }
]