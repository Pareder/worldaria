<template>
  <Loader :is-loading="!loaded">
    <Drawer>
      Choose {{ this.subject === 'continents' ? 'Continent' : 'Country' }}
    </Drawer>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" />
  </Loader>
</template>

<script>
import api from '@/api'
import randomColor from '@/utils/randomColor';
import Loader from '@/components/Loader.vue'
import Drawer from '@/components/Drawer.vue'
import MapComponent from '@/components/MapComponent.vue'

export default {
  data() {
    return {
      geojson: [],
      loaded: false
    }
  },

  props: {
    subject: {
      type: String
    }
  },

  async created() {
    await this.createGeo()
  },

  methods: {
    async createGeo() {
      this.geojson = await api.getGeoJSON(this.subject)
      this.loaded = true
    },

    onEachFeature(feature, layer) {
      layer.setStyle({ fillColor: randomColor() })
      layer.on('click', () => {
        this.changeRoute(layer)
      })
    },

    changeRoute(layer) {
      const name = this.subject === 'continents'
        ? layer.feature.properties.continent.replace(/ /g, '').toLowerCase()
        : layer.feature.properties.name.replace(/ /g, '').toLowerCase()
      this.$router.push(this.subject === 'continents' ? `/learn/continent/${name}` : `/learn/countries/${name}`)
    }
  },

  components: {
    Loader,
    Drawer,
    MapComponent,
  }
}
</script>
