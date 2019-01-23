const db = require('../tools/dbTools')

module.exports = db.defineModel('water_elect_info', {
  waterDegree: db.INTEGER,
  electDegree: db.INTEGER,
  userId: db.STRING(50),
  houseId: db.STRING(50),
  month: db.INTEGER,
  year: db.INTEGER,
  roomNum: db.INTEGER,
  layerNum: db.INTEGER
})
