const { exec } = require('child_process')
const { promisify } = require('util')

const execPromise = promisify(exec)

const findLocalDevices = () =>
  execPromise('arp-scan -l -q').then(({ stdout, stderr }) => {
    if (stderr) throw new Error(stderr)
    const lns = stdout.split('\n').filter(ln => ln.length !== 0) // filter out empty lines
    const resp = lns.map(ln => {
      const parts = ln.split('\t')
      if (parts.length < 2) return
      const ip = parts[0]
      const mac = parts[1]
      // TODO: Normalize HEX number in mac addresses (pad with 0)
      return { ip, mac }
    }).filter(d => d) // remove undefined
    return resp
  })

module.exports = {
  findLocalDevices
}
