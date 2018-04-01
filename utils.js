const knownDevices = require('./known_devices.json')

let db = []

const enrichDeviceData = devices => {
  const enrichedDevices = devices.map(device => {
    const enrichedDevice = { ...device }
    knownDevices.forEach(knownDevice => {
      if (knownDevice.mac === device.mac) {
        enrichedDevice.name = knownDevice.name
      }
    })
    return enrichedDevice
  })
  return enrichedDevices
}

const checkAddedAndRemoved = devices => {
  const nextDb = devices
  const added = nextDb.filter(
    newDevice => !db.find(oldDevice => newDevice.mac === oldDevice.mac),
  ) // check if device came online
  const removed = db.filter(
    oldDevice => !nextDb.find(newDevice => newDevice.mac === oldDevice.mac),
  ) // check if device went away
  db = nextDb
  return { added, removed }
}

const formatter = (device, coming) => {
  const name = device.name ? device.name : device.mac
  const msg = coming ? 'is online' : 'went away'
  const icon = coming ? '✅' : '❌'
  return `${icon} ${name} ${msg}`
}

const toString = ({ added, removed }) => {
  if (added.length === 0 && removed.length === 0) return
  const cameOnline = added.map(device => formatter(device, true))
  const wentOffline = removed.map(device => formatter(device, false))
  return cameOnline.join('\n') + '\n' + wentOffline.join('\n')
}

module.exports = {
  enrichDeviceData,
  checkAddedAndRemoved,
  toString
}
