const rn_bridge = require('rn-bridge')
const express = require('express')
const bodyParser = require('body-parser')

const Dat = require('dat-node')
const fs = require('fs')
const { join } = require('path')

const PORT = 8182
let datPath = ''

const downloadDat = key => {
  return new Promise((resolve, reject) => {
    const path = join(datPath, key)

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }

    Dat(path, {
      key,
      sparse: true
    }, async (err, dat) => {
      if (err) {
        return reject(err)
      }

      dat.joinNetwork(err => {
        dat.archive.readdir('/', (err, files) => {
          if (err) {
            return reject(err)
          }

          return resolve(files)
        })
      })
    })
  })
}

const server = express()
server.use(bodyParser.json())

server.post('/setPath', (req, res) => {
  const { path } = req.body
  datPath = path

  res.send(200)
  res.end()
})

server.post('/download/:key', async (req, res) => {
  const { key } = req.params

  try {
    const files = await downloadDat(key)
    res.json(files)
  } catch (err) {
    res.send(err)
  }

  res.end()
})

server.get('/files/:key', (req, res) => {
  const { key } = req.params

  const files = fs.readdirSync(join(datPath, key))

  res.json(files)
  res.end()
})

server.listen(PORT, () => {

  // Inform react-native node is initialized.
  rn_bridge.channel.send(`Node was initialized.`)
})
