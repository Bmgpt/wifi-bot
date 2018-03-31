const test = require('tape')
const utils = require('./utils')

const exampleDevices = [
  { name: '?', ip: '192.168.1.65', mac: 'd8:a2:5e:00:0f:b1' }
]

const enrichedDevices = [
  { name: 'iPad 1', ip: '192.168.1.65', mac: 'd8:a2:5e:00:0f:b1' }
]

test('enrichDeviceData device added', t => {
  t.plan(1)
  const result = utils.enrichDeviceData(exampleDevices)
  t.deepEqual(result, enrichedDevices)
})

test('checkAddedAndRemoved', t => {
  t.plan(2)
  const { added, removed } = utils.checkAddedAndRemoved(enrichedDevices)
  t.deepEqual(added[0], {
    name: 'iPad 1',
    ip: '192.168.1.65',
    mac: 'd8:a2:5e:00:0f:b1'
  })
  t.deepEqual(removed, [])
})

test('checkAddedAndRemoved device added and removed', t => {
  t.plan(2)

  const input = [
    {
      name: 'Synology at home',
      ip: '192.168.1.70',
      mac: '00:11:32:63:4d:18'
    }
  ]

  const { added, removed } = utils.checkAddedAndRemoved(input)
  t.deepEqual(added[0], {
    name: 'Synology at home',
    ip: '192.168.1.70',
    mac: '00:11:32:63:4d:18'
  })
  t.deepEqual(removed[0], {
    name: 'iPad 1',
    ip: '192.168.1.65',
    mac: 'd8:a2:5e:00:0f:b1'
  })
})

test('toString', t => {
  t.plan(1)
  const added = [
    {
      name: 'Synology at home',
      ip: '192.168.1.70',
      mac: '00:11:32:63:4d:18'
    }
  ]
  const removed = [
    {
      name: 'iPad 1',
      ip: '192.168.1.65',
      mac: 'd8:a2:5e:00:0f:b1'
    }
  ]
  const result = utils.toString({ added, removed })
  t.deepEqual(result, '✅ Synology at home came online ➡ 192.168.1.70\n✅ iPad 1 went away ➡ 192.168.1.65')
})
