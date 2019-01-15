const fs = require('fs')
const path = require('path')
const rpc = require('../rpc/client/client')

class UploadController {
  static async upload (ctx) {
    let id = ctx.state.user._id
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
      let fileName = `${id}#${body.year}${body.month}#${body.layerNum}${body.roomNum}#${i}.${suffix}`
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
    ctx.send({ waterDegree, electDegree }, '上传成功')
  }
}

module.exports = UploadController
