import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

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
    await this.firestore.collection('users').doc(users[0]).set({
      online_games: FieldValue.increment(1),
      total_games: FieldValue.increment(1),
    }, { merge: true })
    await this.firestore.collection('users').doc(users[1]).set({
      online_games: FieldValue.increment(1),
      total_games: FieldValue.increment(1),
    }, { merge: true })
  }
}

export default DB
