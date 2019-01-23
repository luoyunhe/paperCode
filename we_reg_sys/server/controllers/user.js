const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const houseModel = require('../models/houseModel')
const jwtSecret = require('../config/jwtConfig').jwtSecret
class UserController {
  // 用户注册
  static async register (ctx) {
    const data = ctx.request.body
    const checkUser = await userModel.findAll({
      where: { name: data.name }
    })
    if (checkUser.length > 0) {
      return ctx.sendError('000002', '该用户名已存在')
    }

    const result = await userModel.create({
      name: data.name,
      passwd: crypto.createHash('md5').update(data.password).digest('hex') // 密码加密存储
    })
    return result !== null ? ctx.send(null, '注册成功') : ctx.sendError('000002', '注册失败')
  }
  // 用户登录
  static async login (ctx) {
    const data = ctx.request.body
    if (!data.name || !data.password) {
      return ctx.sendError('000002', '参数不合法')
    }
    const result = await userModel.findAll({
      where: {
        name: data.name,
        passwd: crypto.createHash('md5').update(data.password).digest('hex')
      }
    })
    if (result.length > 0) {
      const token = jwt.sign({
        name: result[0].name,
        _id: result[0].id
      }, jwtSecret, { expiresIn: 60 * 60 })
      return ctx.send(token, '登录成功')
    } else {
      return ctx.sendError('000002', '用户名或密码错误')
    }
  }
  static async getUserInfo (ctx) {
    let user = ctx.state.user
    const checkUser = await userModel.findAll({
      where: { id: user._id }
    })
    const checkHouse = await houseModel.findAll({
      where: { userId: user._id }
    })
    return ctx.send({ userInfo: checkUser, houseInfo: checkHouse }, '请求成功')
  }
  static async addHouse (ctx) {
    let body = ctx.request.body
    let user = ctx.state.user
    console.log(user)
    console.log(body)
    const checkHouse = await houseModel.findAll({
      where: { userId: user._id }
    })
    for (let i = 0; i < checkHouse.length; i++) {
      if (body.houseName === checkHouse[i].name) {
        return ctx.sendError('000002', '房屋名重名')
      }
    }
    const result = await houseModel.create({
      name: body.houseName,
      layerSize: parseInt(body.layerSize),
      roomSize: parseInt(body.roomSize),
      userId: user._id
    }).catch((err) => {
      console.log(err)
      return ctx.sendError('000002', '未处理错误')
    })
    console.log(result)
    return ctx.send(null, '添加成功')
  }
}

module.exports = UserController
