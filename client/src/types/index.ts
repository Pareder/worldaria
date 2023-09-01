import type { User } from 'firebase/auth'

export type CountryType = {
  name: string
  formal_en?: string
  capital: string
  language: string
  continent: string
  region_wb: string
  subregion: string
  area: number
  type: string
  government: string
  pop_est: number
  growthRate: number
  expectancy: number
  currency: string
  economy: string
  income_grp: string
  gdp: number
  military: number
  unemployment: number
  elevation: number
  temperature: number
  hdi?: number
  homicide?: number
  iso_a2: number
  iso_a3: number
  symbol?: string
  dish?: string
}

export type TemperatureType = {
  desc: string
  c: number
}

export type AppDataType = {
  user: User | null
}

export type InviteType = {
  myName: string
  opponentName: string
  color: string
  sort: string
  type: string
}
