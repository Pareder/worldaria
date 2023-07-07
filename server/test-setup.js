import { jest } from '@jest/globals'

global.jest = jest

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}))
