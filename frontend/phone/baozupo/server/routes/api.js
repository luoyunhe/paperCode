const router = require('koa-router')()
const User = require('../controllers/user')
const Upload = require('../controllers/upload')

router.post('/register', User.register)
router.post('/login', User.login)
router.get('/get-user-info', User.getUserInfo)
router.post('/add-house', User.addHouse)
router.post('/upload', Upload.upload)

module.exports = router
