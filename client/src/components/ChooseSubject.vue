<template>
  <div v-if="!getChildren">
    <Loader v-show="!loaded" />
    <Drawer>
      <span class="text">Choose {{ this.subject === 'continents' ? 'Continent' : 'Country' }}</span>
    </Drawer>
    <div id="map" v-if="loaded">
      <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" />
    </div>
  </div>
  <router-view v-else></router-view>
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

  computed: {
    getChildren() {
      return this.$route.query.name
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
      if (this.subject === 'continents') {
        this.$router.push({
          name: 'SubjectContinent',
          query: {
            name: layer.feature.properties.continent.replace(/ /g, '').toLowerCase(), 
          }
        })
      } else if (this.subject === 'regions') {
        this.$router.push({
          name: 'SubjectCountry',
          query: {
            name: layer.feature.properties.name.replace(/ /g, '').toLowerCase(),
            country: true,
            latlng: {
              center: layer.getCenter(),
              maxBounds: [
                layer._bounds.getNorthEast(),
                layer._bounds.getSouthWest()
              ],
              zoom: 4
            }
          }
        })
      }
    }
  },

  components: {
    Loader,
    Drawer,
    MapComponent,
  }
}
</script>

<style scoped>
  .text {
    font-size: 22px;
  }

  @media screen and (max-width: 400px) {
    .text {
      font-size: 20px;
    }
  }
</style>