const nodeMailer = require('nodemailer')

class Mailer {
  constructor(transporter, mailOptions) {
    this._transporter = transporter
    this._mailOptions = mailOptions
  }

  static create(config) {
    const transporter = nodeMailer.createTransport(config.nodeMailerOptions)
    const mailOptions = {
      from: config.emailFrom,
      to: config.emailTo,
      subject: 'Weather API date will be ended soon',
      text: 'Hello, the weather API key should be updated today. And dont forget to edit config.js file.'
    }

    return new Mailer(transporter, mailOptions)
  }

  sendMail() {
    this._transporter.sendMail(this._getMailOptions(), err => {
      if (err) {
        return console.error(err)
      }
    })
  }

  _getMailOptions() {
    return {
      ...this._mailOptions,
      html: '<b>Hello, the weather API key should be updated today.' +
        'And dont forget to edit <h2>WEATHER_API.json file</h2>.</b><br>' +
        `<h1>${new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()} - faster</h1>`
    }
  }
}

module.exports = Mailer
