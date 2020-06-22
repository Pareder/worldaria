<template>
  <div>
    <v-map
      ref="map"
      :minZoom="2"
      :center="mapOptions ? mapOptions.center : options.map.center"
      :zoom="mapOptions ? mapOptions.zoom : options.map.zoom"
      :maxBounds="mapOptions ? mapOptions.maxBounds : options.map.maxBounds"
      class="fullHeight"
    >
      <HomeButton />
      <v-geojson v-if="world && world.length > 0" :geojson="world" :options="options.world"></v-geojson>
      <v-geojson :geojson="geojson" :options="options.geojson"></v-geojson>
      <v-geojson v-if="timezones && toggleTimezone" :geojson="timezones" :options="options.timezone"></v-geojson>
    </v-map>
  </div>
</template>

<script>
import { LMap, LGeoJson } from 'vue2-leaflet'
import HomeButton from './HomeButton'

export default {
  data() {
    return {
      options: {
        map: {
          zoom: 2,
          center: [40, 0],
          maxBounds: [[90, -180], [-60, 225]]
        },
        geojson: {
          stroke: true,
          fill: true,
          color: this.botMode === 'extreme' ? '#fff' : (this.botMode === 'impossible' ? '#A3CCFF' : '#000'),
          weight: ['extreme', 'impossible'].includes(this.botMode) ? 1 : 3,
          fillColor: this.botMode === 'impossible' ? '#A3CCFF' : '#fff',
          fillOpacity: 1,
          onEachFeature: this.onEachFeature
        },
        world: {
          stroke: false,
          fill: true,
          fillColor: '#fff',
          fillOpacity: 0.4,
          interactive: false
        },
        timezone: {
          stroke: true,
          fill: true,
          fillOpacity: 0.2,
          onEachFeature: this.bindTimezone
        }
      }
    }
  },

  props: {
    geojson: {
      type: Array
    },
    geoj: {
      type: Array
    },
    onEachFeature: {
      type: Function
    },
    mapOptions: {
      type: Object
    },
    world: {
      type: Array
    },
    timezones: {
      type: Array
    },
    toggleTimezone: {
      type: Boolean
    },
    botMode: {
      type: String
    }
  },

  created() {
    this.$parent.$on('zoomCountry', this.zoom)
    this.$parent.$on('setStartZoom', this.setStartZoom)
  },

  methods: {
    zoom(value) {
      this.$refs.map.mapObject.flyTo({ ...value }, 6)
    },

    setStartZoom() {
      this.$refs.map.mapObject.flyTo({
        lat: this.options.map.center[0],
        lng: this.options.map.center[1]
      }, 3)
    },

    bindTimezone(feature, layer) {
      layer.bindPopup(layer.feature.properties.time_zone)
      layer.setStyle({ fillColor: this.randomColor() })
    }
  },

  components: {
    'v-map': LMap,
    'v-geojson': LGeoJson,
    HomeButton,
  }
}
</script>
