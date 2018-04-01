process.env['NTBA_FIX_319'] = 1
require('dotenv').config()
const arp = require('./arp.js')
const TelegramBot = require('node-telegram-bot-api')
const utils = require('./utils')

const SCAN_INTERVAL = 3000

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN
let scanIntervalId

// logging at startup
arp.findLocalDevices()
  .then(utils.enrichDeviceData)
  .then(console.log)
  .catch(console.log)

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
      arp.findLocalDevices()
        .then(utils.enrichDeviceData)
        // TODO: start pinging ip's to check if device is away
        // for instance with this: ping -c 10 192.168.1.78
        // only based on that show away of online
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
  }, SCAN_INTERVAL)
})

bot.onText(/\/stopscan/, msg => {
  bot.sendMessage(msg.chat.id, 'stopped scanning')
  clearInterval(scanIntervalId)
})
