const db = require('../../db');

module.exports = function defineModelByName(userName, houseName) {
    let tableName = userName + '_' + houseName;
    let modelObj = db.defineModel(tableName, {
        year: db.INTEGER,
        month: db.INTEGER,
        waterDegree: db.DOUBLE,
        electDegree: db.DOUBLE
    });
    modelObj.sync();
    return table;
};