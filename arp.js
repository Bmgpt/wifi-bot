const { exec } = require('child_process')
const { promisify } = require('util')

const execPromise = promisify(exec)

const findLocalDevices = () =>
  execPromise('arp -a').then(({ stdout, stderr }) => {
    if (stderr) throw new Error(stderr)
    const lns = stdout.split('\n').filter(ln => ln.length !== 0) // filter out empty lines
    const resp = lns.map(ln => {
      const parts = ln.split(' ')
      const mac = parts[3]
      return { mac }
    })
    return resp
  })

module.exports = {
  findLocalDevices
}
