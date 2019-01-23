const fs = require('fs')
const path = require('path')
const db = require('../tools/dbTools')

let modelPath = path.join(__dirname, '../models')
let files = fs.readdirSync(modelPath)

let jsFiles = files.filter((f) => {
  return f.endsWith('.js')
}, files)

for (let f of jsFiles) {
  console.log(`import model from file ${f}...`)
  let name = f.substring(0, f.length - 3)
  module.exports[name] = require(path.join(__dirname, '../models', f))
}

db.sync()
