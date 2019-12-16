function express() {
  return {
    use: jest.fn(),
    get: jest.fn()
  }
}

express.static = jest.fn()
express.json = jest.fn()

export default express