import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getFirestoreInstance(serviceAccount) {
  const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
  })
  return getFirestore(app)
}

class DB {
  constructor(firestore) {
    this.firestore = firestore
  }

  static create(serviceAccount) {
    return new DB(getFirestoreInstance(serviceAccount))
  }

  async saveOnlineRecord(users, scores, type, sort) {
    await this.firestore.collection('online').add({
      users,
      scores,
      type,
      sort,
      date: Date.now(),
    })
  }
}

export default DB
