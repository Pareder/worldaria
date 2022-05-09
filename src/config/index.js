import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

function getDatabaseInstance() {
  const envVariables = [
    'VUE_APP_API_KEY',
    'VUE_APP_AUTH_DOMAIN',
    'VUE_APP_DATABASE_URL',
    'VUE_APP_PROJECT_ID',
    'VUE_APP_STORAGE_BUCKET',
    'VUE_APP_MESSAGING_SENDER_ID'
  ]

  for (const variable of envVariables) {
    if (!(variable in process.env)) {
      throw new Error(`Variable ${variable} is not set in .env file`)
    }
  }

  const app = initializeApp({
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_DATABASE_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
  })

  return getDatabase(app)
}

export const database = getDatabaseInstance()

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