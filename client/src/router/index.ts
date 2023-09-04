import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Bot from '@/pages/Bot.vue'
import Details from '@/pages/Details.vue'
import Game from '@/pages/Game.vue'
import History from '@/pages/History.vue'
import Online from '@/pages/Online.vue'
import Profile from '@/pages/Profile.vue'
import Records from '@/pages/Records.vue'
import Settings from '@/pages/Settings'
import Start from '@/pages/Start.vue'
import Subject from '@/components/Subject.vue'
import ChooseSubject from '@/components/ChooseSubject.vue'
import GuessMode from '@/components/GuessMode.vue'

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
      name: 'Game',
      path: '/game',
      component: Game,
      meta: {
        title: 'Worldaria game mode',
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
      name: 'Hard',
      path: '/hard',
      component: GuessMode,
      props: { guessBy: 'name' },
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
      name: 'Flag',
      path: '/flag',
      component: GuessMode,
      props: { guessBy: 'flag' },
      meta: {
        title: 'Worldaria flag mode',
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
      name: 'Capital',
      path: '/capital',
      component: GuessMode,
      props: { guessBy: 'capital' },
      meta: {
        title: 'Worldaria capital mode',
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
      name: 'Area',
      path: '/area',
      component: GuessMode,
      props: { guessBy: 'area' },
      meta: {
        title: 'Worldaria area mode',
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
        },
        {
          name: 'Settings',
          path: '/profile/settings',
          component: Settings,
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
  next()
})

export default router