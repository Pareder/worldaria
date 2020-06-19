const buttons = {
  GAME: {
    name: 'Game',
    description: 'In Game mode you have 5 attempts for each country. Each right answer will give you 1 point. ' +
      'After 5 wrong attempts you will lose 1 point. You can save your current game anytime just quiting it if ' +
      'you are guessing by name.'
  },
  ONLINE: {
    name: 'Online',
    description: 'In Online mode you will play with real person one by one. Each player has 15 seconds to guess ' +
      'the country. After 5 wrong attempts you will not lose points.'
  },
  BOT: {
    name: 'Bot',
    description: 'In Bot mode you will play with the bot, whose difficulty you can choose. You have 15 seconds to ' +
      'guess the country.'
  },
  LEARN: {
    name: 'Learn',
    description: 'In Learn mode you have unlimited attempts. After 5 wrong attempts the right country will be ' +
      'accentuated. You can use search bar to find the right country.'
  },
  DETAILS: {
    name: 'Details',
    description: 'In Details mode you can learn additional information (area, population, etc.) about countries.',
    link: '/learn/details'
  },
  HISTORY: {
    name: 'History',
    description: 'In History mode you can learn historical countries of different periods.',
    link: '/learn/history'
  }
}

export default buttons
