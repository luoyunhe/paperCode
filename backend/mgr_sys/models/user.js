const db = require('')
const tableName = 'users'
module.exports = db.defineModel(tableName, {
    name: db.STRING(100),
    passwd: db.STRING(100)
});
