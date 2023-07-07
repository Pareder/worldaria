export default {
  emailFrom: process.env.MAILER_EMAIL_FROM,
  emailTo: process.env.MAILER_EMAIL_TO,
  weatherAPI: 'https://api.worldweatheronline.com/premium/v1',
  weatherKey: process.env.WEATHER_API_KEY,
  weatherDate: [2019, 0, 11],
  nodeMailerOptions: {
    host: 'smtp.pepipost.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  },
}
