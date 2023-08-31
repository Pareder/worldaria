import Cron from '../index'

const getMailer = () => ({
  sendMail: jest.fn(),
})
const getWeatherAPI = () => ({
  setWeatherKey: jest.fn(),
})
const getNodeCron = () => ({
  schedule: jest.fn(() => ({
    destroy: jest.fn(),
  })),
})

function getModel({ mailer, weatherAPI, nodeCron } = {}) {
  return new Cron(mailer || getMailer(), weatherAPI || getWeatherAPI(), nodeCron || getNodeCron())
}

describe('Cron', () => {
  describe('create static method', () => {
    it('Should return an instance of Cron', () => {
      expect(Cron.create()).toBeInstanceOf(Cron)
    })
  })

  describe('makeTask method', () => {
    it('Should call nodeCron schedule two times with correct parameters', () => {
      const nodeCron = getNodeCron()
      const model = getModel({ nodeCron })
      const date = new Date(2019, 1, 1)
      model.makeTask(date)

      expect(nodeCron.schedule).toBeCalledWith('0 0 31 1 *', expect.any(Function))
      expect(nodeCron.schedule).toBeCalledWith('0 0 1 2 *', expect.any(Function))
    })
  })
})