<template>
  <div v-if="records.length" class="leaderboard my-4">
    <h4 class="title py-2 text-h4 text-center text-grey-lighten-5">Leaderboard</h4>
    <ol class="list">
      <li
        v-for="(record, id) in records"
        :key="id"
        class="item"
      >
        <div class="mark" />
        <div class="user">
          <span class="text-truncate">{{ record.username }}</span>
          <v-icon v-if="record.user === appData?.user?.uid" icon="mdi-account" class="mx-1"></v-icon>
          <span class="ml-auto">{{ record.score }}</span>
          <span class="mx-2">|</span>
          <span class="date flex-shrink-0 text-right">{{ new Date(record.date).toLocaleDateString() }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import type { AppDataType, RecordType } from '@/types'
import { firestore } from '@/config'

type UserRecordType = RecordType & { username: string }

const props = defineProps<{
  type: string
  mode: string
  sort: string
}>()
const appData = inject<Ref<AppDataType>>('appData')
const records = ref<UserRecordType[]>([])
const unsubscribe = ref<() => void>()

onMounted(async () => {
  const q = query(
    collection(firestore, 'games', props.mode, props.type),
    where('sort', '==', props.sort),
    orderBy('score', 'desc'),
    limit(5),
  )
  unsubscribe.value = onSnapshot(q, async snapshot => {
    const promises: Promise<UserRecordType | null>[] = []
    snapshot.forEach(gameDoc => {
      const game = gameDoc.data() as RecordType
      promises.push(new Promise(resolve => {
        getDoc(doc(firestore, 'users', game.user))
          .then(userDoc => {
            const user = userDoc.data() as { name: string }
            resolve({
              ...game,
              username: user?.name,
            })
          })
          .catch(() => resolve(null))
      }))
    })
    records.value = (await Promise.all(promises)).filter(Boolean) as UserRecordType[]
  })
})

onUnmounted(() => unsubscribe.value?.())
</script>

<style scoped lang="scss">
.leaderboard {
  transform-origin: top;
  animation: show-leaderboard 0.5s;
}

@keyframes show-leaderboard {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

.title {
  background: #3a404d;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.list {
  margin-top: 0;
  padding: 0;
  counter-reset: leaderboard;
  list-style-type: none;
}

.item {
  position: relative;
  z-index: 1;
  font-size: 14px;
  counter-increment: leaderboard;
  padding: 18px 10px 18px 50px;
  cursor: pointer;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1.0, 1.0);
  text-align: left;

  &::before {
    content: counter(leaderboard);
    position: absolute;
    z-index: 2;
    top: 18px;
    left: 15px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: #1f332e;
    background: #fff;
    border-radius: 20px;
    text-align: center;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 3px 0 rgba(0, 0, 0, .08);
    transition: all .3s ease-in-out;
    opacity: 0;
  }

  &:nth-child(1) {
    background: #7cccb8;
    &::after {
      background: #7cccb8;
    }
  }
  &:nth-child(2) {
    background: #6cb2a1;
    &::after {
      background: #6cb2a1;
      box-shadow: 0 2px 0 rgba(0, 0, 0, .08);
    }
    .mark {
      &::before, &::after {
        border-top: 6px solid #2e4c45;
        bottom: -7px;
      }
    }
  }
  &:nth-child(3) {
    background: #5d998a;
    &::after {
      background: #5d998a;
      box-shadow: 0 1px 0 rgba(0, 0, 0, .11);
    }
    .mark {
      &::before, &::after {
        border-top: 2px solid #2e4c45;
        bottom: -3px;
      }
    }
  }
  &:nth-child(4) {
    background: #4d7f73;
    &::after {
      background: #4d7f73;
      box-shadow: 0 -1px 0 rgba(0, 0, 0, .15);
    }
    .mark {
      &::before, &::after {
        top: -7px;
        bottom: auto;
        border-top: none;
        border-bottom: 6px solid #2e4c45;
      }
    }
  }
  &:nth-child(5) {
    background: #3e665c;
    border-radius: 0 0 10px 10px;
    &::after {
      background: #3e665c;
      box-shadow: 0 -2.5px 0 rgba(0, 0, 0, .12);
      border-radius: 0 0 10px 10px;
    }
    .mark {
      &::before, &::after {
        top: -9px;
        bottom: auto;
        border-top: none;
        border-bottom: 8px solid #2e4c45;
      }
    }
  }

  &:hover {
    z-index: 2;
    overflow: visible;
    &::after {
      opacity: 1;
      transform: scaleX(1.06) scaleY(1.03);
    }
    .mark {
      &::before, &::after {
        color: #fff;
        opacity: 1;
        transition: all .35s ease-in-out;
      }
    }
  }
}

.mark {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 18px 10px 18px 50px;
  margin: 0;
  background: none;
  color: #fff;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: -11px;
    left: -9px;
    border-top: 10px solid #2e4c45;
    border-left: 10px solid transparent;
    transition: all .1s ease-in-out;
    opacity: 0;
  }

  &::after {
    left: auto;
    right: -9px;
    border-left: none;
    border-right: 10px solid transparent;
  }
}

.user {
  position: relative;
  z-index: 2;
  display: flex;
  font-weight: bold;
}

.date {
  width: 80px;
}
</style>