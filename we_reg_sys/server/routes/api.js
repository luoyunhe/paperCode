const router = require('koa-router')()
const User = require('../controllers/user')
const WEInfo = require('../controllers/weInfo')

router.post('/register', User.register)
router.post('/login', User.login)
router.get('/get-user-info', User.getUserInfo)
router.post('/add-house', User.addHouse)
router.post('/upload', WEInfo.upload)
router.post('/query-we-info', WEInfo.queryWEInfo)

module.exports = router
