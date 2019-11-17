<template>
  <div v-if="!getChildren">
    <Loader v-show="!loaded" />
    <div class="learn_notification">
      Choose {{ this.subject === 'continents' ? 'Continent' : 'Country' }}
    </div>
    <div id="map" v-if="loaded">
      <Map :geojson="geojson" :onEachFeature="onEachFeature" />
    </div>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import router from '../router'
import Loader from './Loader'
import Map from './Map'

export default {
  data () {
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
    getChildren () {
      return this.$route.params.name
    }
  },
  created () {
    this.createGeo()
  },
  methods: {
    createGeo () {
      this.$http.get(`../json/${this.subject}.json`)
        .then(response => {
          this.geojson = [...response.body.features]
          this.loaded = true
        }, response => {
          console.log(response)
      })
    },
    onEachFeature (feature, layer) {
      layer.setStyle({ fillColor: this.randomColor() })
      layer.on('click', () => {
        this.changeRoute(layer)
      })
    },
    changeRoute (layer) {
      if (this.subject === 'continents') {
        router.push({ 
          name: 'SubjectContinent',
          params: { 
            name: layer.feature.properties.continent.replace(/ /g, '').toLowerCase(), 
          }
        })
      } else if (this.subject === 'regions') {
        router.push({ 
          name: 'SubjectCountry',
          params: { 
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
    Map
  }
}
</script>
<style scoped>
.learn_notification {
  position: absolute;
  right: 50px;
  top: 50px;
  width: 300px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  color: #404040;
  background-color: #fff;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.3);
  z-index: 900;
}
@media screen and (max-width: 400px) {
  .learn_notification {
    right: 0;
    top: 10px;
    width: 100%;
    font-size: 20px;
  }
}
</style>