const nodeCron = require('node-cron')

/**
 * Make cron tasks to remind to change WEATHER API key in interval
  */
class Cron {
  constructor(mailer, weatherAPI, nodeCron) {
    this._mailer = mailer
    this._weatherAPI = weatherAPI
    this._nodeCron = nodeCron
  }

  static create(mailer, weatherAPI) {
    return new Cron(mailer, weatherAPI, nodeCron)
  }

  makeTask(date) {
    const dayBefore = new Date(new Date(date).setDate(new Date(date).getDate() - 1))

    const mailTask = this._nodeCron.schedule(
      `0 0 ${new Date(dayBefore).getDate()} ${new Date(dayBefore).getMonth() + 1} *`,
      () => {
        this._mailer.sendMail()
        const newDate = new Date().setMonth(new Date().getMonth() + 2)
        this.makeTask(newDate)
        mailTask.destroy()
      }
    )

    const readApiTask = this._nodeCron.schedule(
      `0 0 ${new Date(date).getDate()} ${new Date(date).getMonth() + 1} *`,
      () => {
        delete require.cache[require.resolve('../config.js')]
        this._weatherAPI.setWeatherKey(require('../config.js').weatherKey)
        readApiTask.destroy()
      }
    )
  }
}

module.exports = Cron
