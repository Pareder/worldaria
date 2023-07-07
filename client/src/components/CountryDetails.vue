<template>
  <div>
    <Loader v-show="!loaded" />
    <DetailsModal v-if="isClicked" :country="selectedCountry" @close="closeModal" />
    <div class="learn_notification">
      <div class="selectors" :class="openNotification ? 'opened' : ''">
        <SelectComponent sortBy="area" v-model="sort.area" @sortBy="sortBy" />
        <SelectComponent sortBy="pop_est" v-model="sort.pop_est" @sortBy="sortBy" />
        <SelectComponent sortBy="growthRate" v-model="sort.growthRate" @sortBy="sortBy" />
        <SelectComponent sortBy="gdp" v-model="sort.gdp" @sortBy="sortBy" />
        <SelectComponent sortBy="expectancy" v-model="sort.expectancy" @sortBy="sortBy" />
        <SelectComponent sortBy="density" v-model="sort.density" @sortBy="sortBy" />
        <SelectComponent sortBy="temperature" v-model="sort.temperature" @sortBy="sortBy" />
        <Checkbox v-model="showTimezone" @toggleTimezone="toggleTimezone" :showTimezone="showTimezone" />
        <SearchCountriesForm
          v-model="searchCountry"
          @search="search"
          @onClick="onClick"
          :foundCountries="foundCountries"
          :showAmount="false"
        />
        <div v-if="!isMobile" class="count">Amount - {{ foundCountries.length || sortedGeojson.length }}</div>
      </div>
      <div class="opener" @click="openNotification = !openNotification">
        <img src="@/assets/images/down.svg" width="16" height="16" :class="openNotification ? 'rotate' : ''">
      </div>
    </div>
    <div id="map" v-if="loaded">
      <MapComponent
        :geojson="sortedGeojson"
        :onEachFeature="onEachFeature"
        :world="world"
        :timezones="timezones"
        :toggleTimezone="showTimezone"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import randomColor from '@/utils/randomColor';
import Loader from '@/components/Loader.vue'
import DetailsModal from '@/modals/DetailsModal.vue'
import MapComponent from '@/components/MapComponent.vue'
import SelectComponent from '@/components/SelectComponent.vue'
import Checkbox from '@/components/Checkbox.vue'
import SearchCountriesForm from '@/components/SearchCountriesForm.vue'

export default {
  data() {
    return {
      value: '',
      geojson: [],
      world: [],
      layers: [],
      sortedGeojson: [],
      loaded: false,
      isClicked: false,
      selectedCountry: {},
      sort: {
        area: 'all',
        pop_est: 'all',
        growthRate: 'all',
        gdp: 'all',
        expectancy: 'all',
        density: 'all',
        temperature: 'all',
      },
      error: false,
      openNotification: false,
      timezones: null,
      showTimezone: false,
      searchCountry: '',
      foundCountries: []
    }
  },

  created() {
    this.createGeo()
  },

  methods: {
    createGeo() {
      Promise.all([api.getMapJSON(), api.getGeoJSON('custom')])
        .then(([world, geojson]) => {
          this.world = world
          this.geojson = geojson
          this.sortedGeojson = [...this.geojson]
          this.loaded = true
        })
    },

    onEachFeature(feature, layer) {
      this.layers.push(layer)
      layer.setStyle({ fillColor: randomColor() })
      layer.on('click', () => {
        this.selectedCountry = layer.feature.properties
        this.isClicked = true
      })
    },

    closeModal() {
      this.isClicked = false
    },

    sortBy(type) {
      this.showTimezone = false
      this.sortedGeojson.length = 0
      this.layers.length = 0

      if (this.sort[type] === 'max') {
        for (const key in this.sort) {
          if (key !== type) {
            this.sort[key] = 'all'
          }
        }

        const max = Math.max.apply(Math, this.geojson.map(geo => {
          return geo.properties[type] ? +geo.properties[type] : 0
        }))
        this.sortedGeojson.push(this.geojson.find(geo => {
          return +geo.properties[type] === max
        }))
      } else if (this.sort[type] === 'min') {
        for (const key in this.sort) {
          if (key !== type) {
            this.sort[key] = 'all'
          }
        }

        const min = Math.min.apply(Math, this.geojson.map(geo => {
          return geo.properties[type] ? +geo.properties[type] : 9999999
        }))
        this.sortedGeojson.push(this.geojson.find(geo => {
          return +geo.properties[type] === min
        }))
      } else {
        this.totalSort()
      }
    },

    totalSort() {
      this.sortedGeojson = [...this.geojson]

      for (const key in this.sort) {
        if (!['all', 'max', 'min'].includes(this.sort[key])) {
          if (Math.sign(this.sort[key]) === -1 || Object.is(Math.sign(this.sort[key]), -0)) {
            this.sortedGeojson = this.sortedGeojson.filter(item => +item.properties[key] < Math.abs(this.sort[key]))
          } else {
            this.sortedGeojson = this.sortedGeojson.filter(item => +item.properties[key] > this.sort[key])
          }
        } else {
          this.sort[key] = 'all'
        }
      }
    },

    search(value) {
      this.foundCountries = []
      if (!value) {
        return
      }

      for (let i = 0; i < this.layers.length; i++) {
        if (value?.length > 0 && this.layers[i].feature.properties.name.toLowerCase().startsWith(value.toLowerCase())) {
          this.foundCountries.push(this.layers[i].feature.properties.name)
        }
      }

      this.foundCountries.sort()
    },

    onClick(country) {
      const searchingCountry = this.layers.find(item => {
        return item.feature.properties.name.toLowerCase() === country.toLowerCase()
      })

      if (searchingCountry) {
        searchingCountry.fire('click')
        this.error = false
      } else {
        this.error = true
      }
    },

    removeError() {
      this.error = false
    },

    async toggleTimezone() {
      this.timezones = await api.getTimezoneJSON()
    }
  },

  components: {
    Loader,
    DetailsModal,
    MapComponent,
    SelectComponent,
    Checkbox,
    SearchCountriesForm
  }
}
</script>

<style scoped lang="scss">
  .learn_notification {
    position: absolute;
    width: 100%;
    font-size: 20px;
    z-index: 900;
  }
  .selectors {
    overflow: hidden;
    transition: all 0.5s;
    height:0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #9bffe6;
  }
  .opened {
    height: auto;
    padding: 20px;
    overflow: visible;
  }
  .opener {
    position: absolute;
    bottom: -30px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #51667f;
    cursor: pointer;
  }
  img {
    transform: rotateX(0);
    transition: all 0.5s;
  }
  .rotate {
    transform: rotateX(180deg);
  }

  .squaredThree {
    position: relative;
    padding: 0 10px;
    label {
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: absolute;
      bottom: 0;
      left: calc(50% - 10px);
      background: linear-gradient(to top, #222 0%, #45484d 100%);
      border-radius: 4px;
      box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,.4);
      &:after {
        content: '';
        width: 9px;
        height: 5px;
        position: absolute;
        top: 4px;
        left: 4px;
        border: 3px solid #fcfff4;
        border-top: none;
        border-right: none;
        background: transparent;
        opacity: 0;
        transform: rotate(-45deg);
      }
      &:hover::after {
        opacity: 0.3;
      }
    }
    input[type=checkbox] {
      visibility: hidden;
      &:checked + label:after {
        opacity: 1;
      }
    }
  }
  .count {
    width: 140px;
    text-align: left;
  }
</style>