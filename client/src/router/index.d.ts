export {}

import 'vue-router'

interface MetaTag {
  name?: string,
  property?: string,
  content: string,
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    metaTags: MetaTag[],
  }
}
