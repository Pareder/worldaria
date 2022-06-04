# [Worldaria](http://worldaria.herokuapp.com)
[![dependencies Status](https://img.shields.io/librariesio/github/Pareder/worldaria)](https://img.shields.io)
[![Heroku](http://heroku-badge.herokuapp.com/?app=worldaria&style=flat&svg=1)](http://worldaria.herokuapp.com)
<p align="center">
  <img src="public/img/logo/512x512.png" alt="Worldaria">
</p>

**Worldaria** is the geographical game to learn countries and regions of our planet. There are 6 modes to try:

* **Game:** you have 5 attempts to guess each suggested country. Each right answer will give you 1 point. After 5 wrong attempts you will lose 1 point. You can save your current game result anytime just quiting it if you are guessing by **name**.
* **Online:** you will play with real person one by one. Each player has 15 seconds to guess the country. After 5 wrong attempts you will not lose points. **To play this mode you should sign in**.
* **Bot:** you will play with the bot, whose difficulty you can choose. You have 15 seconds to guess the country.
* **Learn:** you have unlimited attempts to guess the country. After 5 wrong attempts the right country will be accentuated. You can use search bar to find the right country.
* **Details:** you can learn additional information (area, population, etc.) about countries just clicking on them.
* **History:** you can learn historical countries of different periods.

## Maps

All used maps have [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) format. Some of them were found in open repositories like these (https://github.com/AshKyd/geojson-regions, https://github.com/mledoze/countries, etc.) and others were converted from Shapefile ([downloaded here](https://gadm.org/)) to GeoJSON using https://mapshaper.org/.

All countries' statistics were found in open sources and updated manually.

## Used

* [Vue.js](https://vuejs.org)
* [Leaflet](https://leafletjs.com)
* [Express](https://expressjs.com/)
* [Firebase](https://firebase.google.com)
* [socket.io](https://socket.io)

## Project Setup
```
npm install
```

### Starts the server
```
npm start
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Runs unit tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
