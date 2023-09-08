import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Bot from '@/pages/Bot.vue'
import Details from '@/pages/Details.vue'
import GameArea from '@/pages/GameArea.vue'
import GameCapital from '@/pages/GameCapital.vue'
import GameFlag from '@/pages/GameFlag.vue'
import GameName from '@/pages/GameName.vue'
import History from '@/pages/History.vue'
import Leaderboard from '@/pages/Leaderboard.vue'
import Online from '@/pages/Online.vue'
import Profile from '@/pages/Profile.vue'
import Records from '@/pages/Records'
import Settings from '@/pages/Settings'
import Start from '@/pages/Start.vue'
import Subject from '@/components/Subject.vue'
import ChooseSubject from '@/components/ChooseSubject.vue'

type MetaTagName = {
  name: string,
  content: string,
}

type MetaTagProperty = {
  property: string,
  content: string,
}

type MetaTag = MetaTagName | MetaTagProperty

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    metaTags: MetaTag[],
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Start',
      path: '/',
      component: Start,
      meta: {
        title: 'Worldaria - learn the world!',
        metaTags: [
          {
            name: 'description',
            content: 'Worldaria is the first educational geographical game in which you can learn all countries, their capitals, their regions. Learn the world and enjoy!',
          },
          {
            property: 'og:description',
            content: 'Worldaria is the first educational geographical game in which you can learn all countries, their capitals, their regions. Learn the world and enjoy!',
          },
        ],
      },
    },
    {
      name: 'GameName',
      path: '/game/name',
      component: GameName,
      meta: {
        title: 'Worldaria - country name mode',
        metaTags: [
          {
            name: 'description',
            content: 'Try to guess all the countries and get the best score.',
          },
          {
            property: 'og:description',
            content: 'Try to guess all the countries and get the best score.',
          },
        ],
      },
    },
    {
      name: 'GameFlag',
      path: '/game/flag',
      component: GameFlag,
      meta: {
        title: 'Worldaria - country flag mode',
        metaTags: [
          {
            name: 'description',
            content: 'Try to guess countries by their flags.',
          },
          {
            property: 'og:description',
            content: 'Try to guess countries by their flags.',
          },
        ],
      },
    },
    {
      name: 'GameCapital',
      path: '/game/capital',
      component: GameCapital,
      meta: {
        title: 'Worldaria - country capital mode',
        metaTags: [
          {
            name: 'description',
            content: 'Try to guess countries by their capitals.',
          },
          {
            property: 'og:description',
            content: 'Try to guess countries by their capitals.',
          },
        ],
      },
    },
    {
      name: 'GameArea',
      path: '/game/area',
      component: GameArea,
      meta: {
        title: 'Worldaria - country area mode',
        metaTags: [
          {
            name: 'description',
            content: 'Try to guess countries by their territories dragging country to appropriate place on world map.',
          },
          {
            property: 'og:description',
            content: 'Try to guess countries by their territories dragging country to appropriate place on world map.',
          },
        ],
      },
    },
    {
      name: 'Learn',
      path: '/learn',
      redirect: '/learn/full',
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn countries if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn countries if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/full',
      component: Subject,
      name: 'Subject',
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn countries if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn countries if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/continent',
      component: ChooseSubject,
      name: 'LearnContinent',
      props: { subject: 'continents' },
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn countries by continents if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn countries by continents if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/continent/:name',
      component: Subject,
      name: 'SubjectContinent',
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn countries by continents if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn countries by continents if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/countries',
      component: ChooseSubject,
      name: 'LearnCountry',
      props: { subject: 'regions' },
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn regions of the countries if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn regions of the countries if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/countries/:name',
      component: Subject,
      name: 'SubjectCountry',
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn regions of the countries if you don\'t know them.',
          },
          {
            property: 'og:description',
            content: 'You can learn regions of the countries if you don\'t know them.',
          },
        ],
      },
    },
    {
      path: '/learn/details',
      component: Details,
      name: 'CountryDetails',
      meta: {
        title: 'Worldaria details mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn population, area, gdp, temperature of all countries and even more.',
          },
          {
            property: 'og:description',
            content: 'You can learn population, area, gdp, temperature of all countries and even more.',
          },
        ],
      },
    },
    {
      path: '/learn/history',
      component: History,
      name: 'CountryHistory',
      meta: {
        title: 'Worldaria history mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn the history of countries\' creation.',
          },
          {
            property: 'og:description',
            content: 'You can learn the history of countries\' creation.',
          },
        ],
      },
    },
    {
      name: 'Online',
      path: '/online',
      component: Online,
      meta: {
        auth: true,
        title: 'Worldaria online mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can face other people to try win them if countries\' guessing.',
          },
          {
            property: 'og:description',
            content: 'You can face other people to try win them if countries\' guessing.',
          },
        ],
      },
    },
    {
      name: 'Bot',
      path: '/bot',
      component: Bot,
      meta: {
        title: 'Worldaria bot mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can play with bot with different levels of difficulty.',
          },
          {
            property: 'og:description',
            content: 'You can play with bot with different levels of difficulty.',
          },
        ],
      },
    },
    {
      name: 'Profile',
      path: '/profile',
      redirect: '/profile/records',
      component: Profile,
      meta: {
        auth: true,
        title: 'Profile',
        metaTags: [
          {
            name: 'description',
            content: 'Personal profile',
          },
          {
            property: 'og:description',
            content: 'Personal profile',
          },
        ],
      },
      children: [
        {
          name: 'Records',
          path: '/profile/records',
          component: Records,
          meta: {
            auth: true,
            title: 'Records',
            metaTags: [
              {
                name: 'description',
                content: 'Personal records',
              },
              {
                property: 'og:description',
                content: 'Personal records',
              },
            ],
          },
        },
        {
          name: 'Leaderboard',
          path: '/profile/leaderboard',
          component: Leaderboard,
          meta: {
            auth: true,
            title: 'Leaderboard',
            metaTags: [
              {
                name: 'description',
                content: 'Users leaderboard',
              },
              {
                property: 'og:description',
                content: 'Users leaderboard',
              },
            ],
          },
        },
        {
          name: 'Settings',
          path: '/profile/settings',
          component: Settings,
          meta: {
            auth: true,
            title: 'Settings',
            metaTags: [
              {
                name: 'description',
                content: 'Personal settings',
              },
              {
                property: 'og:description',
                content: 'Personal settings',
              },
            ],
          },
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta?.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta?.metaTags)

  if (typeof nearestWithTitle?.meta?.title === 'string') {
    document.title = nearestWithTitle.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode?.removeChild(el))

  nearestWithMeta?.meta.metaTags.map?.(tagDef => {
    const tag = document.createElement('meta')
    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key as keyof MetaTag])
    })
    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  }).forEach(tag => document.head.appendChild(tag))

  if (to.matched.some(r => r.meta?.auth)) {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe()
      if (user) {
        next()
      } else {
        next('/')
      }
    })
    return
  }

  next()
})

export default router