const db = require('../db');

module.exports = db.defineModel('user_house_info', {
    userName: db.STRING(100),
    houseName: db.STRING(100),
    houseLayerNum: db.INTEGER,
    houseRoomNum: db.INTEGER
});