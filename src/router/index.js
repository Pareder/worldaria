import Vue from 'vue'
import Router from 'vue-router'
import Start from '../pages/Start'
import Game from '../pages/Game'
import Learn from '../pages/Learn'
import Online from '../pages/Online'
import Bot from '../pages/Bot'
import Subject from '../components/Subject'
import ChooseSubject from '../components/ChooseSubject'
import CountryDetails from '../components/CountryDetails'
import CountryHistory from '../components/CountryHistory'
import GuessMode from '../components/GuessMode'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: '/',
  linkActiveClass: 'active',
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
            content: 'Worldaria is the first educational geographical game in which you can learn all countries, their capitals, their regions. Learn the world and enjoy!'
          },
          {
            property: 'og:description',
            content: 'Worldaria is the first educational geographical game in which you can learn all countries, their capitals, their regions. Learn the world and enjoy!'
          }
        ]
      }
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
            content: 'Try to guess all the countries and get the best score.'
          },
          {
            property: 'og:description',
            content: 'Try to guess all the countries and get the best score.'
          }
        ]
      }
    },
    {
      name: 'Learn',
      path: '/learn',
      component: Learn,
      redirect: '/learn/full',
      meta: {
        title: 'Worldaria learn mode',
        metaTags: [
          {
            name: 'description',
            content: 'You can learn countries if you don\'t know them.'
          },
          {
            property: 'og:description',
            content: 'You can learn countries if you don\'t know them.'
          }
        ]
      },
      children: [
        {
          path: '/learn/full',
          component: Subject,
          name: 'Subject',
          props: { mode: 'learn' },
          meta: {
            title: 'Worldaria learn mode',
            metaTags: [
              {
                name: 'description',
                content: 'You can learn countries if you don\'t know them.'
              },
              {
                property: 'og:description',
                content: 'You can learn countries if you don\'t know them.'
              }
            ]
          }
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
                content: 'You can learn countries by continents if you don\'t know them.'
              },
              {
                property: 'og:description',
                content: 'You can learn countries by continents if you don\'t know them.'
              }
            ]
          },
          children: [
            {
              path: '/learn/continent/:name',
              component: Subject,
              name: 'SubjectContinent',
              props: { mode: 'learn' },
              meta: {
                title: 'Worldaria learn mode',
                metaTags: [
                  {
                    name: 'description',
                    content: 'You can learn countries by continents if you don\'t know them.'
                  },
                  {
                    property: 'og:description',
                    content: 'You can learn countries by continents if you don\'t know them.'
                  }
                ]
              },
            }
          ]
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
                content: 'You can learn regions of the countries if you don\'t know them.'
              },
              {
                property: 'og:description',
                content: 'You can learn regions of the countries if you don\'t know them.'
              }
            ]
          },
          children: [
            {
              path: '/learn/countries/:name',
              component: Subject,
              name: 'SubjectCountry',
              props: { mode: 'learn' },
              meta: {
                title: 'Worldaria learn mode',
                metaTags: [
                  {
                    name: 'description',
                    content: 'You can learn regions of the countries if you don\'t know them.'
                  },
                  {
                    property: 'og:description',
                    content: 'You can learn regions of the countries if you don\'t know them.'
                  }
                ]
              }
            }
          ]
        },
        {
          path: '/learn/details',
          component: CountryDetails,
          name: 'CountryDetails',
          props: { mode: 'details' },
          meta: {
            title: 'Worldaria details mode',
            metaTags: [
              {
                name: 'description',
                content: 'You can learn population, area, gdp, temperature of all countries and even more.'
              },
              {
                property: 'og:description',
                content: 'You can learn population, area, gdp, temperature of all countries and even more.'
              }
            ]
          }
        },
        {
          path: '/learn/history',
          component: CountryHistory,
          name: 'CountryHistory',
          meta: {
            title: 'Worldaria history mode',
            metaTags: [
              {
                name: 'description',
                content: 'You can learn the history of countries\' creation.'
              },
              {
                property: 'og:description',
                content: 'You can learn the history of countries\' creation.'
              }
            ]
          }
        }
      ]
    },
    {
      name: 'Online',
      path: '/online',
      component: Online,
      meta: {
        title: 'Worldaria online mode',
        metaTags: [
        {
          name: 'description',
          content: 'You can face other people to try win them if countries\' guessing.'
        },
        {
          property: 'og:description',
          content: 'You can face other people to try win them if countries\' guessing.'
        }
        ]
      }
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
          content: 'You can play with bot with different levels of difficulty.'
        },
        {
          property: 'og:description',
          content: 'You can play with bot with different levels of difficulty.'
        }
        ]
      }
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
          content: 'You can play with bot with different levels of difficulty.'
        },
        {
          property: 'og:description',
          content: 'You can play with bot with different levels of difficulty.'
        }
        ]
      }
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
          content: 'Try to guess countries by their flags.'
        },
        {
          property: 'og:description',
          content: 'Try to guess countries by their flags.'
        }
        ]
      }
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
          content: 'Try to guess countries by their capitals.'
        },
        {
          property: 'og:description',
          content: 'Try to guess countries by their capitals.'
        }
        ]
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  if (!nearestWithMeta) return next()

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')
    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })
    tag.setAttribute('data-vue-router-controlled', '')
    return tag
  }).forEach(tag => document.head.appendChild(tag))
  next()
})

export default router