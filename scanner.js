require('dotenv').config()
const findLocalDevices = require('local-devices')
const TelegramBot = require('node-telegram-bot-api')
const utils = require('./utils')

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN
let scanIntervalId

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true
})

bot.onText(/\/scan/, msg => {
  bot.sendMessage(msg.chat.id, 'started scanning...')
  let isSearching
  scanIntervalId = setInterval(() => {
    if (!isSearching) {
      isSearching = true
      findLocalDevices()
        .then(utils.enrichDeviceData)
        .then(utils.checkAddedAndRemoved)
        .then(utils.toString)
        .then(str => {
          if (str) bot.sendMessage(msg.chat.id, str)
          isSearching = false
        })
        .catch(err => {
          console.log('Error while search', err)
        })
    }
  }, 3000)
})

bot.onText(/\/stopscan/, msg => {
  bot.sendMessage(msg.chat.id, 'stopped scanning')
  clearInterval(scanIntervalId)
})

