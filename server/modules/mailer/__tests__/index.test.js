import Mailer from '../index'

const nodeMailerOptions = {
  host: 'host.com',
  port: 1,
  secure: false,
  auth: {
    user: 'user',
    pass: 'pass',
  },
}
const getTransporter = () => ({
  sendMail: jest.fn(),
})

function getModel({ transporter, mailOptions } = {}) {
  return new Mailer(transporter || getTransporter(), mailOptions || {})
}

describe('Mailer', () => {
  describe('create static method', () => {
    it('Should return an instance of Mailer', () => {
      expect(Mailer.create({nodeMailerOptions})).toBeInstanceOf(Mailer)
    })
  })

  describe('sendMail method', () => {
    it('Should call transporter sendMail with correct parameters', () => {
      const transporter = getTransporter()
      const mailOptions = {
        option: 'option',
      }
      const model = getModel({ transporter, mailOptions })
      model.sendMail()

      expect(transporter.sendMail).toBeCalledWith({
        ...mailOptions,
        html: expect.any(String),
      }, expect.any(Function))
    })
  })
})