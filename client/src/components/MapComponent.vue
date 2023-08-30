<template>
  <div>
    <v-map
      ref="map"
      :minZoom="2"
      :center="options.map.center"
      :zoom="options.map.zoom"
      :maxBounds="options.map.maxBounds"
      class="h-screen"
      @ready="autoFitBounds()"
    >
      <HomeButton />
      <v-geojson v-if="world && world.length > 0" :geojson="world" :options="options.world"></v-geojson>
      <v-geojson v-if="geojson && geojson.length > 0" :geojson="geojson" :options="options.geojson"></v-geojson>
      <v-geojson v-if="timezones && toggleTimezone" :geojson="timezones" :options="options.timezone"></v-geojson>
    </v-map>
  </div>
</template>

<script>
import { featureGroup } from 'leaflet'
import { LMap, LGeoJson } from '@vue-leaflet/vue-leaflet'

import randomColor from '@/utils/randomColor';
import HomeButton from '@/components/HomeButton.vue'

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
      type: Array,
    },
    onEachFeature: {
      type: Function,
    },
    world: {
      type: Array,
    },
    timezones: {
      type: Array,
    },
    toggleTimezone: {
      type: Boolean,
    },
    botMode: {
      type: String,
    },
    flyBounds: {
      type: Object,
    },
    center: {
      type: Array,
    },
  },

  watch: {
    flyBounds(bounds) {
      if (!bounds) {
        return
      }

      this.$refs.map.leafletObject.fitBounds(bounds, { padding: [20, 20] })
    },

    center(center) {
      if (!center) {
        return
      }

      this.$refs.map.leafletObject.flyTo({
        lat: center[0],
        lng: center[1],
      }, 3)
    },
  },

  methods: {
    bindTimezone(feature, layer) {
      layer.bindPopup(layer.feature.properties.time_zone)
      layer.setStyle({ fillColor: randomColor() })
    },

    autoFitBounds() {
      const map = this.$refs.map.leafletObject
      const group = new featureGroup()
      map.eachLayer(layer => {
        if (layer.feature) {
          group.addLayer(layer)
        }
      })
      map.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  },

  components: {
    'v-map': LMap,
    'v-geojson': LGeoJson,
    HomeButton,
  }
}
</script>
