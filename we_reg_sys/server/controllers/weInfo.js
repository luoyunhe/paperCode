const fs = require('fs')
const path = require('path')
const rpc = require('../rpc/client/client')
const weInfoModel = require('../models/WEInfoModel')

class WEInfoController {
  static async upload (ctx) {
    let userId = ctx.state.user._id
    let name = ctx.state.user.name
    let body = ctx.request.body
    let imgs = body.imgs
    body.imgs = null
    console.log(body)
    let filePaths = []
    for (let i = 0; i < imgs.length; i++) {
      let base64Start = imgs[i].indexOf(',', 0) + 1
      let suffixEnd = imgs[i].indexOf(';base64', 0)
      let suffix = imgs[i].substr(11, suffixEnd - 11)
      let content = imgs[i].substr(base64Start)
      let imgBuff = Buffer.from(content, 'base64')
      let fileName = `${name}@${body.houseInfo.id}@${body.year}${body.month}@${body.layerNum}${body.roomNum}@${i}.${suffix}`
      filePaths.push(path.join(__dirname, '../imgStore/', fileName))
      await fs.writeFileSync(filePaths[i], imgBuff)
    }
    let waterDegree = await rpc.recognize({
      imgPath: filePaths[0],
      type: 0
    })
    let electDegree = await rpc.recognize({
      imgPath: filePaths[1],
      type: 1
    })
    let weInfoFound = await weInfoModel.findAll({
      where: {
        userId: userId,
        houseId: body.houseInfo.id,
        month: body.month,
        year: body.year,
        roomNum: body.roomNum,
        layerNum: body.layerNum
      }
    })
    if (weInfoFound.length > 0) {
      await weInfoFound[0].update({
        waterDegree: waterDegree.degree,
        electDegree: electDegree.degree
      })
    } else {
      await weInfoModel.create({
        waterDegree: waterDegree.degree,
        electDegree: electDegree.degree,
        userId: userId,
        houseId: body.houseInfo.id,
        month: body.month,
        year: body.year,
        roomNum: body.roomNum,
        layerNum: body.layerNum
      })
    }
    ctx.send({ waterDegree, electDegree }, '上传成功')
  }
  static async queryWEInfo (ctx) {
    let body = ctx.request.body
    let houseId = body.houseInfo.id
    let year = body.year
    let month = body.month
    let weInfoFound = await weInfoModel.findAll({
      where: {
        year,
        month,
        houseId
      },
      order: [
        ['layerNum'],
        ['roomNum']
      ]
    })

    ctx.send(weInfoFound, '查询成功')
  }
}

module.exports = WEInfoController
