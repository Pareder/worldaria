export const ALL = 'all'
export const MIN = 'min'
export const MAX = 'max'

export type SelectValue = typeof ALL | typeof MIN | typeof MAX | number

export default {
  area: {
    label: 'Area',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 10 k',
        value: -10000,
      },
      {
        title: 'Less 100 k',
        value: -100000,
      },
      {
        title: 'Less 500 k',
        value: -500000,
      },
      {
        title: 'More 500 k',
        value: 500000,
      },
      {
        title: 'More 1 m',
        value: 1000000,
      },
      {
        title: 'More 5 m',
        value: 5000000,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  pop_est: {
    label: 'Population',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 1 m',
        value: -1000000,
      },
      {
        title: 'Less 2 m',
        value: -2000000,
      },
      {
        title: 'Less 5 m',
        value: -5000000,
      },
      {
        title: 'More 5 m',
        value: 5000000,
      },
      {
        title: 'More 10 m',
        value: 10000000,
      },
      {
        title: 'More 50 m',
        value: 50000000,
      },
      {
        title: 'More 100 m',
        value: 100000000,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  growthRate: {
    label: 'Population growth',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 0 %',
        value: -0,
      },
      {
        title: 'More 0 %',
        value: 0,
      },
      {
        title: 'More 1 %',
        value: 1,
      },
      {
        title: 'More 2 %',
        value: 2,
      },
      {
        title: 'More 3 %',
        value: 3,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  gdp: {
    label: 'GDP',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 1 k',
        value: -1000,
      },
      {
        title: 'Less 2 k',
        value: -2000,
      },
      {
        title: 'Less 5 k',
        value: -5000,
      },
      {
        title: 'More 5 k',
        value: 5000,
      },
      {
        title: 'More 10 k',
        value: 10000,
      },
      {
        title: 'More 20 k',
        value: 20000,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  expectancy: {
    label: 'Life',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 60 years',
        value: -60,
      },
      {
        title: 'Less 70 years',
        value: -70,
      },
      {
        title: 'More 70 years',
        value: 70,
      },
      {
        title: 'More 80 years',
        value: 80,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  density: {
    label: 'Density',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 10',
        value: -10,
      },
      {
        title: 'Less 50',
        value: -50,
      },
      {
        title: 'Less 100',
        value: -100,
      },
      {
        title: 'More 100',
        value: 100,
      },
      {
        title: 'More 200',
        value: 200,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
  temperature: {
    label: 'Temperature',
    data: [
      {
        title: 'All',
        value: 'all',
      },
      {
        title: 'Less 0 °C',
        value: -0,
      },
      {
        title: 'Less 10 °C',
        value: -10,
      },
      {
        title: 'More 10 °C',
        value: 10,
      },
      {
        title: 'More 20 °C',
        value: 20,
      },
      {
        title: 'More 25 °C',
        value: 25,
      },
      {
        title: 'Min',
        value: 'min',
      },
      {
        title: 'Max',
        value: 'max',
      },
    ],
  },
}