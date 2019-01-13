const db = require('../tools/dbTools')

module.exports = db.defineModel('users', {
  name: {
    type: db.STRING(100),
    unique: true
  },
  passwd: db.STRING(100)
})
